interface TemperatureProps {
  temp: any;
}

/**
 * Numeric component that displays the temperature value.
 * 
 * @param {number} props.temp - The temperature value to be displayed.
 * @returns {JSX.Element} The rendered Numeric component.
 */
function Numeric({ temp }: TemperatureProps) {
  // TODO: Change the color of the text based on the temperature
  // HINT:
  //  - Consider using cn() from the utils folder for conditional tailwind styling
  //  - (or) Use the div's style prop to change the colour
  //  - (or) other solution

  // Justify your choice of implementation in brainstorming.md

  const formattedTemp = temp.toFixed(3);

  let temperatureClass = "";

  if (temp < 20 || temp > 80) {
    // Unsafe: below 20 or above 80
    temperatureClass = "text-unsafe";
  } else if ((temp >= 20 && temp < 25) || (temp > 75 && temp <= 80)) {
    // Nearing Unsafe: between 20-25 or 75-80
    temperatureClass = "text-nearingUnsafe";
  } else {
    // Safe: between 25 and 75
    temperatureClass = "text-safe";
  }

  return (
    <div className="text-foreground text-4xl font-bold">
      {`${formattedTemp}°C`}
    </div>
  );
}

export default Numeric;
