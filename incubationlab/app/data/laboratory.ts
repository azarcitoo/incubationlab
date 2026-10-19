export type IncubatorType = "forced-air" | "still-air";
export type Comparison = "below" | "within" | "above";

export type LaboratorySettings = {
  day: number;
  incubatorType: IncubatorType;
  temperatureF: number;
  wetBulbF: number;
  turningEnabled: boolean;
  ventilationProgressive: boolean;
};

export type LaboratoryAssessment = {
  temperature: Comparison;
  humidity: Comparison;
  turningMatchesReference: boolean;
  referenceTemperatureF: number;
  wetBulbRangeF: readonly [number, number];
};

function compare(value: number, minimum: number, maximum: number): Comparison {
  if (value < minimum) return "below";
  if (value > maximum) return "above";
  return "within";
}

export function assessLaboratorySettings(
  settings: LaboratorySettings,
): LaboratoryAssessment {
  const lateIncubation = settings.day >= 19;
  const wetBulbRangeF: readonly [number, number] = lateIncubation
    ? [89, 90]
    : [85, 87];

  return {
    temperature: compare(
      settings.temperatureF,
      settings.incubatorType === "forced-air" ? 99 : 101,
      settings.incubatorType === "forced-air" ? 101 : 103,
    ),
    humidity: compare(settings.wetBulbF, wetBulbRangeF[0], wetBulbRangeF[1]),
    turningMatchesReference: settings.day <= 18
      ? settings.turningEnabled
      : !settings.turningEnabled,
    referenceTemperatureF: settings.incubatorType === "forced-air" ? 100 : 102,
    wetBulbRangeF,
  };
}

export function getLaboratoryReference(day: number) {
  return {
    temperatureForcedAirF: 100,
    temperatureStillAirF: 102,
    humidityRelativePercent: day <= 18 ? "58–60 %" : "al menos 65 %",
    wetBulbF: day <= 18 ? "85–87 °F" : "89–90 °F",
    turning: day <= 18 ? "2–3 veces al día" : "detener el volteo",
  };
}
