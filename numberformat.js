document.addEventListener('DOMContentLoaded', function() {
    const numberElements = document.querySelectorAll('.number');

    numberElements.forEach(function(element) {
        const number = parseFloat(element.textContent);

        if (number > 0) {
            element.classList.add('positive');
            element.textContent = `▲ ${number}`;
        } else if (number < 0) {
            element.classList.add('negative');
            element.textContent = `▼ ${Math.abs(number)}`;
        }
    });
});
