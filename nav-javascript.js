
		const clickDiv = document.getElementById("clickDiv");
		const targetDiv = document.getElementById("targetDiv");

		clickDiv.addEventListener("click", function() {
			// Toggle the 'expanded' class to handle expansion and collapsing
			targetDiv.classList.toggle("expanded");

			if (targetDiv.style.height === '0px' || targetDiv.style.height === '') {
				// Measure the auto height by temporarily setting the div's height to 'auto'
				const autoHeight = targetDiv.scrollHeight + 'px';
				
				// Set height to current computed height
				targetDiv.style.height = autoHeight;

				// Once the animation is done, set the height to 'auto' to adapt to content changes
				setTimeout(() => {
					targetDiv.style.height = 'auto';
				}, 500); // Match the transition duration
			} else {
				// If it's expanded, collapse it
				targetDiv.style.height = targetDiv.scrollHeight + 'px'; // Set the height to its current scroll height
				setTimeout(() => {
					targetDiv.style.height = '0px'; // Shrink back to zero
				}, 10); // Small delay to allow the previous height setting to take effect
			}
		});

		// Add event listener to the links inside targetDiv to remove expanded class and collapse div
		targetDiv.addEventListener("click", function(event) {
			if (event.target.tagName === "A") {
				// Remove the 'expanded' class when a link is clicked
				targetDiv.classList.remove("expanded");

				// Collapse the div by setting height back to 0
				targetDiv.style.height = targetDiv.scrollHeight + 'px'; // Set height to its current height
				setTimeout(() => {
					targetDiv.style.height = '0px'; // Animate height back to 0
				}, 10);
			}
		});
