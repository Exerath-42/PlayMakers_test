# Badge Validation App

This web application allows users to validate badges based on certain criteria such as size, transparency, and color composition. The validation is performed using JavaScript and HTML, with the help of the FileReader API and canvas drawing.

## How to Use

1. Open the `index.html` file in a web browser.

2. Click on the "Choose File" button and select a badge image file in PNG format.

3. The application will check the badge against the following criteria:

   - **Size:** The badge must have dimensions of 512x512 pixels.
   - **Shape:** Non-transparent pixels must be within a circle.
   - **Color:** The badge should have a good mix of "Happy" colors (red or yellow).

4. The validation result will be displayed, indicating whether the badge is valid or not.

## Test Images

Sample badge images for testing are provided in the `./badge_examples` folder. You can use these images to evaluate the validation criteria.

