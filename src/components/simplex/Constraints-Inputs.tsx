import { Input } from "../ui/input";

type ConstraintsInputsProps = {
  constraints: number[][];
  updateConstraint: (row: number, col: number, value: number) => void;
  numVars: number;
  rhs: number[];
  updateRhs: (index: number, value: number) => void;
};

export default function ConstraintsInputs({
  constraints,
  updateConstraint,
  numVars,
  rhs,
  updateRhs,
}: ConstraintsInputsProps) {
  return (
    <div className="mb-4">
      <h2 className="text-xl font-semibold mb-2">Constraints</h2>
      {constraints.map((row, i) => (
        <div key={i} className="flex items-center my-2">
          {row.map((coeff, j) => (
            <div key={j} className="flex items-center">
              <Input
                type="number"
                value={coeff}
                onChange={(e) =>
                  updateConstraint(i, j, parseFloat(e.target.value))
                }
                className="w-20 mx-1"
              />
              <span>x{j + 1}</span>
              {j < numVars - 1 && <span className="mx-1">+</span>}
            </div>
          ))}
          <span className="mx-2">≤</span>
          <Input
            type="number"
            value={rhs[i]}
            onChange={(e) => updateRhs(i, parseFloat(e.target.value))}
            className="w-20"
          />
        </div>
      ))}
    </div>
  );
}
