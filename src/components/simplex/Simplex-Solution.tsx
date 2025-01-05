type SimplexSolutionProps = {
  solution: {
    tableau: number[][];
  };
  numVars: number;
};

export default function SimplexSolution({
  solution,
  numVars,
}: SimplexSolutionProps) {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-2">Solution</h2>
      <p>
        Z = {-solution.tableau[0][solution.tableau[0].length - 1].toFixed(1)}
      </p>
      <h3 className="text-2xl font-semibold mt-2 mb-2">Variables:</h3>
      <ul>
        {Array(numVars)
          .fill(0)
          .map((_, i) => {
            let value = 0;
            for (let row = 1; row < solution.tableau.length; row++) {
              if (Math.abs(solution.tableau[row][i] - 1) < 0.000001) {
                value = solution.tableau[row][solution.tableau[0].length - 1];
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
    </>
  );
}
