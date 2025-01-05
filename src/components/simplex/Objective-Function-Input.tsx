import { Input } from "../ui/input";

type ObjectiveFunctionInputProps = {
  objectiveCoeffs: number[];
  updateObjectiveCoeff: (index: number, value: number) => void;
  numVars: number;
};

export default function ObjectiveFunctionInput({
  objectiveCoeffs,
  updateObjectiveCoeff,
  numVars,
}: ObjectiveFunctionInputProps) {
  return (
    <div className="mb-5">
      <h2 className="text-xl font-semibold mb-2">Objective Function</h2>
      <div className="flex items-center gap-2 mb-2">
        <span>Max Z =</span>
        {objectiveCoeffs.map((coeff, index) => (
          <div key={index} className="flex items-center">
            <Input
              type="number"
              value={coeff}
              onChange={(e) =>
                updateObjectiveCoeff(index, parseFloat(e.target.value))
              }
              className="w-20 mx-1"
            />
            <span>x{index + 1}</span>
            {index < numVars - 1 && <span className="mx-1">+</span>}
          </div>
        ))}
      </div>
    </div>
  );
}
