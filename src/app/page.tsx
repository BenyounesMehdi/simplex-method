"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Page() {
  const [numVars, setNumVars] = useState(2);
  const [numConstraints, setNumConstraints] = useState(2);
  const [objectiveCoeffs, setObjectiveCoeffs] = useState<number[]>([1, 1]);
  const [constraints, setConstraints] = useState<number[][]>([
    [1, 1],
    [1, 1],
  ]);
  const [rhs, setRhs] = useState<number[]>([5, 5]);
  const [solution, setSolution] = useState<any>(null);
  const [pivotCells, setPivotCells] = useState<{ row: number; col: number }[]>(
    []
  );

  useEffect(() => {
    generateRandomInputs();
  }, [numVars, numConstraints]);

  const generateRandomInputs = () => {
    const randomCoeffs = Array(numVars)
      .fill(0)
      .map(() => Math.floor(Math.random() * 10) + 1);
    const randomConstraints = Array(numConstraints)
      .fill(0)
      .map(() =>
        Array(numVars)
          .fill(0)
          .map(() => Math.floor(Math.random() * 10) + 1)
      );
    const randomRhs = Array(numConstraints)
      .fill(0)
      .map(() => Math.floor(Math.random() * 50) + 10);

    setObjectiveCoeffs(randomCoeffs);
    setConstraints(randomConstraints);
    setRhs(randomRhs);
  };

  const updateObjectiveCoeff = (index: number, value: number) => {
    const newCoeffs = [...objectiveCoeffs];
    newCoeffs[index] = value;
    setObjectiveCoeffs(newCoeffs);
  };

  const updateConstraint = (row: number, col: number, value: number) => {
    const newConstraints = constraints.map((r, i) =>
      i === row ? r.map((c, j) => (j === col ? value : c)) : r
    );
    setConstraints(newConstraints);
  };

  const updateRhs = (index: number, value: number) => {
    const newRhs = [...rhs];
    newRhs[index] = value;
    setRhs(newRhs);
  };

  const solve = () => {
    const multiplier = 1;
    let tableau = createTableau(
      objectiveCoeffs.map((c) => multiplier * c),
      constraints,
      rhs
    );
    let result = simplexMethod(tableau, numVars, numConstraints);
    setSolution(result);
  };

  const createTableau = (
    objectiveCoeffs: number[],
    constraints: number[][],
    rhs: number[]
  ) => {
    let tableau = [
      [...objectiveCoeffs, ...Array(numConstraints).fill(0), 0],
      ...constraints.map((row, i) => [
        ...row,
        ...Array(numConstraints)
          .fill(0)
          .map((_, j) => (i === j ? 1 : 0)),
        rhs[i],
      ]),
    ];
    return tableau;
  };

  const simplexMethod = (
    tableau: number[][],
    numVars: number,
    numConstraints: number
  ) => {
    let iterations = [];
    let iteration = 0;
    const maxIterations = 100;
    let basicVars = Array(numConstraints)
      .fill(0)
      .map((_, i) => numVars + i);
    let pivotHistory: { row: number; col: number }[] = [];

    while (iteration < maxIterations) {
      iterations.push({
        tableau: JSON.parse(JSON.stringify(tableau)),
        basicVars: [...basicVars],
      });

      let pivotCol = tableau[0]
        .slice(0, -1)
        .indexOf(Math.max(...tableau[0].slice(0, -1)));
      if (tableau[0][pivotCol] <= 0) break;

      let ratios = tableau
        .slice(1)
        .map((row) =>
          row[pivotCol] <= 0 ? Infinity : row[row.length - 1] / row[pivotCol]
        );
      let pivotRow = ratios.indexOf(Math.min(...ratios)) + 1;
      if (pivotRow === 0) return null;

      pivotHistory.push({ row: pivotRow, col: pivotCol });

      basicVars[pivotRow - 1] = pivotCol;

      let pivot = tableau[pivotRow][pivotCol];
      tableau = tableau.map((row, i) =>
        i === pivotRow
          ? row.map((val) => val / pivot)
          : row.map(
              (val, j) =>
                val - (tableau[i][pivotCol] / pivot) * tableau[pivotRow][j]
            )
      );

      iteration++;
    }

    setPivotCells(pivotHistory);
    return { tableau, iterations };
  };

  const isPivotCell = (
    iterationIndex: number,
    rowIndex: number,
    colIndex: number
  ) => {
    if (!pivotCells[iterationIndex]) return false;
    const pivot = pivotCells[iterationIndex];
    return pivot.row === rowIndex && pivot.col === colIndex;
  };

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex flex-col sm:flex-row justify-center items-center gap-4">
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

      <div className="flex flex-col justify-center items-center mt-5">
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
      </div>

      <div className="flex justify-center">
        <Button onClick={solve}>Solve</Button>
      </div>

      {solution && (
        <div className="mt-4">
          <h3 className="text-2xl font-semibold mt-4 mb-2">Tables:</h3>
          {solution.iterations.map((iteration: any, index: number) => (
            <div key={index} className="mb-4">
              <h4 className="font-semibold">Tab {index}:</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Base</TableHead>
                    {iteration.tableau[0]
                      .slice(0, -1)
                      .map((_: number, i: number) => (
                        <TableHead key={i}>
                          {i < numVars ? `x${i + 1}` : `s${i - numVars + 1}`}
                        </TableHead>
                      ))}
                    <TableHead>C</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {iteration.tableau
                    .slice(1)
                    .map((row: number[], rowIndex: number) => (
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
                    {iteration.tableau[0].map(
                      (val: number, colIndex: number) => (
                        <TableCell key={colIndex}>{val.toFixed(1)}</TableCell>
                      )
                    )}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ))}
          <h2 className="text-2xl font-semibold mb-2">Solution</h2>
          <p>
            Optimal Value:{" "}
            {-solution.tableau[0][solution.tableau[0].length - 1].toFixed(1)}
          </p>
          <h3 className="text-2xl font-semibold mt-2 mb-2">Variables:</h3>
          <ul>
            {Array(numVars)
              .fill(0)
              .map((_, i) => {
                let value = 0;
                for (let row = 1; row < solution.tableau.length; row++) {
                  if (Math.abs(solution.tableau[row][i] - 1) < 0.000001) {
                    value =
                      solution.tableau[row][solution.tableau[0].length - 1];
                    break;
                  }
                }
                return (
                  <li key={i}>
                    x{i + 1} = {value.toFixed(1)}
                  </li>
                );
              })}
          </ul>
        </div>
      )}
    </div>
  );
}
