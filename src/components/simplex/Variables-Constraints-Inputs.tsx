import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

interface VariablesConstraintsInputsProps {
  numVars: number;
  setNumVars: (num: number) => void;
  numConstraints: number;
  setNumConstraints: (num: number) => void;
  generateRandomInputs: () => void;
}

export default function VariablesConstraintsInputs({
  numVars,
  setNumVars,
  numConstraints,
  setNumConstraints,
  generateRandomInputs,
}: VariablesConstraintsInputsProps) {
  return (
    <div className="mb-4 flex flex-col justify-center items-center gap-4">
      <Label htmlFor="numVars" className="text-lg">
        Number of Variables:
      </Label>
      <Input
        id="numVars"
        type="number"
        min="2"
        value={numVars}
        onChange={(e) => setNumVars(parseInt(e.target.value))}
        className="w-20"
      />
      <Label htmlFor="numConstraints" className="text-lg">
        Number of Constraints:
      </Label>
      <Input
        id="numConstraints"
        type="number"
        min="1"
        value={numConstraints}
        onChange={(e) => setNumConstraints(parseInt(e.target.value))}
        className="w-20"
      />
      <Button onClick={generateRandomInputs}>Generate Random Values</Button>
    </div>
  );
}
