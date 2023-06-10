// Attach an event listener to the 'sub' element when clicked
document.getElementById("sub").addEventListener("click", function () {
  // Get the height and weight values from the input fields
  let h = document.getElementById("height").value;
  let w = document.getElementById("weight").value;

  // Convert height to meters
  h /= 100.0;

  // Calculate BMI
  let bmi = w / (h * h);

  // Round BMI to two decimal places
  bmi = parseFloat(bmi).toFixed(2);

  let img;
  let data = "";

  // Determine the BMI category and corresponding image
  if (bmi < 19) {
    data = "You Are Underweight";
    img = "./assets/underweight.jpg";
  } else if (bmi >= 19 && bmi <= 25) {
    data = "You Are Healthy";
    img = "./assets/healthy.jpg";
  } else if (bmi > 25 && bmi <= 30) {
    data = "You Are Overweight";
    img = "./assets/overweight.jpg";
  } else if (bmi > 30) {
    data = "You Are Obese";
    img = "./assets/obese.jpg";
  } else {
    data = "Please Enter a Valid Input";
  }

  // Set the source attribute of the 'body' element to display the appropriate image
  document.getElementById("body").setAttribute("src", img);

  // Display the result and BMI information
  document.getElementById("res").innerHTML = ` ${data}.`;
  document.getElementById(
    "result"
  ).innerHTML = `Your BMI is <strong>${bmi}</strong>.`;

  // Show the 'info' card
  document.getElementById("info").setAttribute("class", "card show");
});
