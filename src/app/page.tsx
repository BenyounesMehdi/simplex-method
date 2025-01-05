"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

import VariablesConstraintsInputs from "@/components/simplex/Variables-Constraints-Inputs";
import ObjectiveFunctionInput from "@/components/simplex/Objective-Function-Input";
import ConstraintsInputs from "@/components/simplex/Constraints-Inputs";
import SimplexTables from "@/components/simplex/Simplex-Tables";

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
    const tableau = createTableau(
      objectiveCoeffs.map((c) => multiplier * c),
      constraints,
      rhs
    );
    const result = simplexMethod(tableau, numVars, numConstraints);
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
    const iterations = [];
    let iteration = 0;
    const maxIterations = 100;
    const basicVars = Array(numConstraints)
      .fill(0)
      .map((_, i) => numVars + i);
    const pivotHistory: { row: number; col: number }[] = [];

    while (iteration < maxIterations) {
      iterations.push({
        tableau: JSON.parse(JSON.stringify(tableau)),
        basicVars: [...basicVars],
      });

      const pivotCol = tableau[0]
        .slice(0, -1)
        .indexOf(Math.max(...tableau[0].slice(0, -1)));
      if (tableau[0][pivotCol] <= 0) break;

      const ratios = tableau
        .slice(1)
        .map((row) =>
          row[pivotCol] <= 0 ? Infinity : row[row.length - 1] / row[pivotCol]
        );
      const pivotRow = ratios.indexOf(Math.min(...ratios)) + 1;
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

  useEffect(() => {
    generateRandomInputs();
  }, [numVars, numConstraints]);

  return (
    <div className="container mx-auto p-4">
      <VariablesConstraintsInputs
        numVars={numVars}
        setNumVars={setNumVars}
        numConstraints={numConstraints}
        setNumConstraints={setNumConstraints}
        generateRandomInputs={generateRandomInputs}
      />

      <div className="flex flex-col justify-center items-center mt-5">
        <ObjectiveFunctionInput
          objectiveCoeffs={objectiveCoeffs}
          updateObjectiveCoeff={updateObjectiveCoeff}
          numVars={numVars}
        />

        <ConstraintsInputs
          constraints={constraints}
          updateConstraint={updateConstraint}
          numVars={numVars}
          rhs={rhs}
          updateRhs={updateRhs}
        />
      </div>

      <div className="flex justify-center">
        <Button onClick={solve}>Solve</Button>
      </div>

      <SimplexTables
        solution={solution}
        numVars={numVars}
        isPivotCell={isPivotCell}
      />
    </div>
  );
}
