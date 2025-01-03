from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import tensorflow as tf
import numpy as np
import cv2
from PIL import Image, ImageDraw
import io
import rasterio
import matplotlib.pyplot as plt

app = Flask(__name__)
CORS(app)  # Enable CORS for cross-origin requests

# Load the trained model
MODEL_PATH = r"C:\Users\swarg\Desktop\Udaan\SAR\unet_mask_model.h5"  # Path to the saved model
model = tf.keras.models.load_model(MODEL_PATH)

# Extract the input shape of the model
input_shape = model.input_shape
IMG_HEIGHT, IMG_WIDTH = input_shape[1], input_shape[2]  # Extract height and width


# Helper function to create a mask from polygon
def create_polygon_mask(image_shape, polygon_coords):
    """
    Creates a binary mask for the given polygon coordinates.
    :param image_shape: Shape of the original image (height, width)
    :param polygon_coords: List of (x, y) tuples representing polygon vertices
    :return: Binary mask with the polygon filled
    """
    mask = Image.new("L", (image_shape[1], image_shape[0]), 0)  # Grayscale mask
    draw = ImageDraw.Draw(mask)
    draw.polygon(polygon_coords, outline=255, fill=255)  # Fill the polygon with white
    return np.array(mask)


# Function to normalize the bands for better visualization (colorization)
def normalize_band(band, clip_percentile=2):
    """Normalize band values for better visualization, applying clipping."""
    band = np.nan_to_num(band, nan=0.0)  # Replace NaN with 0
    low, high = np.percentile(band[band > 0], (clip_percentile, 100 - clip_percentile))
    band = np.clip(band, low, high)
    return (band - band.min()) / (band.max() - band.min())


# Route to handle image processing for colorization
@app.route('/process-rgb-image', methods=['POST'])
def process_rgb_image():
    try:
        # Ensure an image is uploaded
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        # Load the uploaded image
        image_file = request.files['image']
        image = Image.open(image_file)
        image_array = np.array(image)

        # Check if image is already RGB, if not, convert it
        if image_array.ndim == 2:  # If grayscale image, create an RGB image
            image_array = cv2.cvtColor(image_array, cv2.COLOR_GRAY2RGB)

        # Perform colorization logic (similar to RGB band normalization)
        red = normalize_band(image_array[:, :, 0])
        green = normalize_band(image_array[:, :, 1])
        blue = normalize_band(image_array[:, :, 2]) * 0.8  # Adjust blue intensity
        rgb_image = np.dstack((red, green, blue))

        # Predict the mask using the processed image
        rgb_resized = cv2.resize(rgb_image, (IMG_WIDTH, IMG_HEIGHT))
        rgb_normalized = rgb_resized / 255.0
        rgb_input = np.expand_dims(rgb_normalized, axis=0)  # Add batch dimension

        # Predict mask using the model
        predicted_mask = model.predict(rgb_input)

        # Postprocess the predicted mask
        final_mask = np.squeeze(predicted_mask, axis=0)  # Remove batch dimension
        final_mask = (final_mask > 0.5).astype(np.uint8)  # Convert to binary mask
        final_mask = final_mask * 255  # Scale to 0-255

        # Convert the mask to an image
        mask_image = Image.fromarray(final_mask)
        if mask_image.mode != 'L':  # Ensure grayscale mode
            mask_image = mask_image.convert('L')

        # Save the mask to an in-memory file
        file_object = io.BytesIO()
        mask_image.save(file_object, 'PNG')
        file_object.seek(0)

        # Return the masked image as a response
        return send_file(file_object, mimetype='image/png')

    except Exception as e:
        app.logger.error(f"Error processing RGB image: {e}")
        return jsonify({"error": "Failed to process RGB image"}), 500


# Route to handle regular image processing (no colorization)
@app.route('/process-image', methods=['POST'])
def process_image():
    try:
        # Ensure an image is uploaded
        if 'image' not in request.files:
            return jsonify({"error": "No image uploaded"}), 400

        # Load the uploaded image
        image_file = request.files['image']
        image = Image.open(image_file)

        # Convert the image to a NumPy array
        image_array = np.array(image)

        # Preprocess the image: resize and normalize
        image_resized = cv2.resize(image_array, (IMG_WIDTH, IMG_HEIGHT))
        image_normalized = image_resized / 255.0
        image_input = np.expand_dims(image_normalized, axis=0)  # Add batch dimension

        # Predict mask using the model
        predicted_mask = model.predict(image_input)

        # Postprocess the predicted mask
        final_mask = np.squeeze(predicted_mask, axis=0)  # Remove batch dimension
        final_mask = (final_mask > 0.5).astype(np.uint8)  # Convert to binary mask
        final_mask = final_mask * 255  # Scale to 0-255

        # Ensure final_mask is 2D
        if final_mask.ndim == 3 and final_mask.shape[-1] == 1:
            final_mask = np.squeeze(final_mask, axis=-1)

        # Ensure the mask is in the correct format for saving
        mask_image = Image.fromarray(final_mask)
        if mask_image.mode != 'L':  # Ensure grayscale mode
            mask_image = mask_image.convert('L')

        # Save the mask to an in-memory file
        file_object = io.BytesIO()
        mask_image.save(file_object, 'PNG')
        file_object.seek(0)

        # Return the masked image as a response
        return send_file(file_object, mimetype='image/png')

    except Exception as e:
        app.logger.error(f"Error processing image: {e}")
        return jsonify({"error": "Failed to process image"}), 500


# Run the server
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=False)
