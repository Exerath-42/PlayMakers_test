// Event listener for the change event on the badge input element
document.getElementById('badgeInput').addEventListener('change', function () {
    validateBadge();
});

// Function to validate the badge based on size, transparency, and color criteria
function validateBadge() {
    // Get necessary DOM elements
    var input = document.getElementById('badgeInput');
    var validationResult = document.getElementById('validationResult');
    var badgeContainer = document.getElementById('badgeContainer');

    // Check if a file has been selected
    if (input.files && input.files[0]) {
        // Get the selected badge image file
        var badgeImage = input.files[0];

        // Create a FileReader to read the image data
        var reader = new FileReader();
        reader.onload = function (e) {
            // Get the image data from the FileReader result
            var imageData = e.target.result;

            // Create an image element and set its source to the loaded image data
            var img = new Image();
            img.src = imageData;

            img.onload = function () {
                // Check if the badge has the correct size
                if (img.width === 512 && img.height === 512) {
                    // Check if non-transparent pixels are within a circle and colors meet criteria
                    if (isInsideCircle(img) && checkColors(img)) {
                        validationResult.innerHTML = 'Badge is valid!';
                        showBadgeImage(imageData, badgeContainer);
                    } else if (!isInsideCircle(img)) {
                        validationResult.innerHTML = 'Badge is not valid: Non-transparent pixels must be within a circle.';
                        clearBadgeContainer();
                    } else {
                        validationResult.innerHTML = 'Badge is not valid: Use more "Happy" colors (red or yellow).';
                        clearBadgeContainer();
                    }
                } else {
                    validationResult.innerHTML = 'Badge is not valid: Badge size must be 512x512 pixels.';
                    clearBadgeContainer();
                }
            };
        };

        // Read the badge image data as a data URL
        reader.readAsDataURL(badgeImage);
    }
}

// Function to display the badge image in the specified container
function showBadgeImage(imageData, container) {
    // Clear the badge container
    clearBadgeContainer();

    // Create an image element and set its source to the provided image data
    var badgeImage = document.createElement('img');
    badgeImage.src = imageData;

    // Append the image element to the specified container
    container.appendChild(badgeImage);
}

// Function to clear the badge container
function clearBadgeContainer() {
    var badgeContainer = document.getElementById('badgeContainer');
    badgeContainer.innerHTML = '';
}

// Function to check if non-transparent pixels are within a circle
function isInsideCircle(img) {
    // Create a canvas and draw the image on it
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Calculate the center and radius of the circle
    var centerX = img.width / 2;
    var centerY = img.height / 2;
    var radius = Math.min(img.width, img.height) / 2;

    // Iterate through each pixel to check its position relative to the circle
    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            // Get pixel data and check if it's transparent
            var pixelData = ctx.getImageData(x, y, 1, 1).data;
            var isTransparent = pixelData[3] === 0;

            // Calculate the distance to the center of the circle
            var distanceToCenter = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));

            // Check if the pixel is outside the circle and not transparent
            if (distanceToCenter > radius && !isTransparent) {
                return false;
            }
        }
    }

    // If all non-transparent pixels are inside the circle, return true
    return true;
}

// Function to check if the colors meet certain criteria (black less than red and yellow)
function checkColors(img) {
    // Create a canvas and draw the image on it
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0, img.width, img.height);

    // Variables to count total non-transparent pixels, black pixels, red pixels, and yellow pixels
    var totalNonTransparentPixels = 0;
    var blackPixels = 0;
    var redPixels = 0;
    var yellowPixels = 0;

    // Iterate through each pixel to analyze its color
    for (var x = 0; x < img.width; x++) {
        for (var y = 0; y < img.height; y++) {
            // Get pixel data and check if it's transparent
            var pixelData = ctx.getImageData(x, y, 1, 1).data;
            var isTransparent = pixelData[3] === 0;

            // If the pixel is not transparent, increment the total count
            if (!isTransparent) {
                totalNonTransparentPixels++;

                // Check if the pixel is black, red, or yellow based on color thresholds
                var isBlack = pixelData[0] < 20 && pixelData[1] < 20 && pixelData[2] < 20;
                var isRed = pixelData[0] > 150 && pixelData[1] < 100 && pixelData[2] < 100;
                var isYellow = pixelData[0] > 180 && pixelData[1] > 150 && pixelData[2] < 100;

                // Increment respective color counters
                if (isBlack) {
                    blackPixels++;
                }
                if (isRed) {
                    redPixels++;
                }
                if (isYellow) {
                    yellowPixels++;
                }
            }
        }
    }

    // Return true if the ratio of black pixels to total non-transparent pixels is less than red and yellow
    return (blackPixels / totalNonTransparentPixels) < (redPixels / totalNonTransparentPixels) ||
           (blackPixels / totalNonTransparentPixels) < (yellowPixels / totalNonTransparentPixels);
}
