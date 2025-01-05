import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import SimplexSolution from "./Simplex-Solution";

type Solution = {
  tableau: number[][];
  iterations: {
    tableau: number[][];
    basicVars: number[];
  }[];
};

type SimplexSolutionProps = {
  solution: Solution;
  numVars: number;
  isPivotCell: (tab: number, row: number, col: number) => boolean;
};

export default function SimplexTables({
  solution,
  numVars,
  isPivotCell,
}: SimplexSolutionProps) {
  return (
    solution && (
      <div className="mt-4">
        <h3 className="text-2xl font-semibold mt-4 mb-2">Tables:</h3>
        {solution.iterations.map((iteration, index) => (
          <div key={index} className="mb-4">
            <h4 className="font-semibold">Tab {index}:</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Base</TableHead>
                  {iteration.tableau[0].slice(0, -1).map((_, i) => (
                    <TableHead key={i}>
                      {i < numVars ? `x${i + 1}` : `s${i - numVars + 1}`}
                    </TableHead>
                  ))}
                  <TableHead>C</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {iteration.tableau.slice(1).map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>
                      {iteration.basicVars[rowIndex] < numVars
                        ? `x${iteration.basicVars[rowIndex] + 1}`
                        : `s${iteration.basicVars[rowIndex] - numVars + 1}`}
                    </TableCell>
                    {row.map((val, colIndex) => (
                      <TableCell
                        key={colIndex}
                        className={
                          isPivotCell(index, rowIndex + 1, colIndex)
                            ? "bg-red-500"
                            : ""
                        }
                      >
                        {val.toFixed(1)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell>&#916; </TableCell>
                  {iteration.tableau[0].map((val, colIndex) => (
                    <TableCell key={colIndex}>{val.toFixed(1)}</TableCell>
                  ))}
                </TableRow>
              </TableBody>
            </Table>
          </div>
        ))}

        <SimplexSolution solution={solution} numVars={numVars} />
      </div>
    )
  );
}
