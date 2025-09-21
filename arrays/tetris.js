/*Filling a Grid with Tetris-Like Figures (CodeSignal Solution)

Problem Restatement

We need to fill an n × m grid (initially all zeros) with a sequence of figures labeled A through E, similar to Tetris pieces. Each figure has a fixed shape (no rotations allowed) and must be placed one by one in the given order. When placing a figure, it should occupy empty cells, and of all possible placements, use the topmost (lowest row index) position, and if there are multiple, the leftmost column among those【6†】. Each figure is represented in the grid by an integer equal to its 1-based index in the input list. The task is to output the final 2D grid after placing all figures.

Key Rules Recap:
	•	Order: Place figures sequentially in the order they appear in the input array.
	•	Shape & Orientation: Each figure A–E has a specific shape (like Tetris blocks) and cannot be rotated.
	•	No Overlap: A new figure cannot overlap previously placed figures (must go in empty cells only).
	•	Placement Strategy: Choose the valid placement with the smallest row index (highest position in the grid). If multiple placements share that row, choose the one with the smallest column index (furthest left).
	•	Grid Fit: All figures are guaranteed to fit into the grid under these rules.

Figure Shape Definitions

From the problem description and examples, we can deduce the shapes of figures A through E (using 1 to indicate the cells occupied by the shape, in its fixed orientation):
	•	Figure A: A single block (1×1).
Shape matrix: [[1]] – occupies one cell.
	•	Figure B: A horizontal line of 3 blocks (1×3).
Shape matrix: [[1, 1, 1]] – occupies three cells in a row.
	•	Figure C: A 2×2 square of 4 blocks (like the O-tetromino).
Shape matrix: [[1, 1], [1, 1]] – occupies a square of four cells.
	•	Figure D: A T-shaped tetromino (4 blocks) oriented vertically with an extra block to the right in the middle.
Shape matrix:

[1, 0]  
[1, 1]  
[1, 0]  

This shape occupies 4 cells in an L-like pattern: three blocks in a column and one attached to the right of the center block【6†】. (In coordinates relative to the shape’s top-left, the filled cells are at (0,0), (1,0), (1,1), and (2,0).)

	•	Figure E: A 6-block shape spanning 2 rows and 4 columns.
Shape matrix:

[0, 1, 0, 1]  
[1, 1, 1, 1]  

This shape has a full row of 4 blocks with two additional blocks offset above the second and fourth columns【4†】. (Filled coordinates relative to top-left: (0,1), (0,3), (1,0), (1,1), (1,2), (1,3).)

Note: These shapes are derived from the CodeSignal prompt. For example, figure E as given will occupy a pattern of cells as shown above, and figure C is the classic square tetromino【6†】. No rotations are allowed, so these patterns are used as-is for placement.

Approach and Algorithm

The solution approach is to iterate through each figure and scan the grid from top-left to bottom-right to find the first valid placement according to the rules. We maintain the grid as a 2D array of integers (initially all 0). For each figure with its shape pattern:
	1.	Determine Shape Dimensions: Get the shape’s height (number of rows in its pattern) and width (number of columns in its pattern), as well as the list of filled cell offsets for that shape.
	2.	Scan for Placement: Loop over each possible top-left placement (r, c) in row-major order (row by row, left to right):
	•	Ensure the shape’s area fits within bounds (i.e., r + shapeHeight <= n and c + shapeWidth <= m).
	•	Check every filled cell of the shape pattern. For each filled offset (dr, dc), verify that the target grid cell (r+dr, c+dc) is currently 0 (empty). If any filled cell would overlap a non-zero cell or go out of bounds, that placement is invalid.
	•	The first placement found by scanning from top-left will automatically be the one with the lowest row and then leftmost column (due to the scanning order). Place the shape there by setting all corresponding grid cells to the figure’s index value.
	3.	Proceed to Next Figure: Continue to the next figure in the list and repeat the scanning process on the updated grid.

This greedy scanning approach ensures we respect the topmost-leftmost placement rule without needing complex comparisons.

Complexity: Scanning the grid for each figure takes at most O(nm) checks, and we do this for each figure. With up to 500 figures, the worst-case time complexity is O(n * m * figures.length)【6†】. Given the constraints (n, m ≤ 50, figures.length ≤ 500), this is at most 5050*500 = 1,250,000 checks, which is efficient for modern JavaScript engines.

Example Walk-through

Consider n = 4, m = 4, and figures = [‘D’, ‘B’, ‘A’, ‘C’], as provided in the prompt’s example. The figures are placed as follows:
	•	Figure 1 (D): Placed at the top-left (its T-shape occupies cells in the first three rows, starting at column 0).
	•	Figure 2 (B): Scans from top; the first row has space starting at column 1 (since D occupies column 0). B’s 1×3 line fits at row 0 columns 1–3.
	•	Figure 3 (A): The first row is full, so it places at the next available top position: row 1, column 2 (first empty cell in row 1).
	•	Figure 4 (C): The 2×2 square can’t fit on row 0 or 1 without overlap, and fails at row 2 col0 due to D. It finds a fit at row 2, col 1.

The resulting grid (with 1-based indices marking each piece) would be:

[[1, 2, 2, 2],  
 [1, 1, 3, 0],  
 [1, 4, 4, 0],  
 [0, 4, 4, 0]]  

Here each number corresponds to the figure index (1=D, 2=B, 3=A, 4=C) placed in that cell.

JavaScript Solution Code

Below is the JavaScript code implementing this logic. It defines the shape patterns for A–E, then iterates through the figures list, placing each shape in the grid according to the rules. In the end, it prints the resulting matrix.
*/
function fillGrid(n, m, figures) {
  // Define shape patterns for A-E as arrays of coordinate offsets for filled cells
  const shapeOffsets = {
    'A': [{r: 0, c: 0}],  // single block
    'B': [{r: 0, c: 0}, {r: 0, c: 1}, {r: 0, c: 2}],  // horizontal line of length 3
    'C': [{r: 0, c: 0}, {r: 0, c: 1}, {r: 1, c: 0}, {r: 1, c: 1}],  // 2x2 square
    'D': [{r: 0, c: 0}, {r: 1, c: 0}, {r: 1, c: 1}, {r: 2, c: 0}],  // T-shaped tetromino (oriented with extra block to right of center)
    'E': [
      {r: 0, c: 1}, {r: 0, c: 3},
      {r: 1, c: 0}, {r: 1, c: 1}, {r: 1, c: 2}, {r: 1, c: 3}
    ]  // 6-block shape spanning 2 rows and 4 cols
  };

  // Determine shape bounding dimensions for convenience
  const shapeDimensions = {
    'A': {h: 1, w: 1},
    'B': {h: 1, w: 3},
    'C': {h: 2, w: 2},
    'D': {h: 3, w: 2},
    'E': {h: 2, w: 4}
  };

  // Initialize empty grid n x m filled with 0
  const grid = Array.from({ length: n }, () => Array(m).fill(0));

  // Place each figure in order
  for (let i = 0; i < figures.length; i++) {
    const fig = figures[i];             // e.g., 'A', 'B', ..., 'E'
    const indexVal = i + 1;             // 1-based index value to fill in grid
    const offsets = shapeOffsets[fig];  // filled cell offsets for this shape
    const { h: shapeH, w: shapeW } = shapeDimensions[fig];

    // Find the valid placement (topmost, then leftmost)
    let placed = false;
    for (let r = 0; r <= n - shapeH && !placed; r++) {
      for (let c = 0; c <= m - shapeW && !placed; c++) {
        // Check if shape can fit at top-left (r,c) without overlap
        let canPlace = true;
        for (const { r: dr, c: dc } of offsets) {
          if (grid[r + dr][c + dc] !== 0) {
            canPlace = false;
            break;
          }
        }
        if (canPlace) {
          // Place the shape: mark all its filled cells with indexVal
          for (const { r: dr, c: dc } of offsets) {
            grid[r + dr][c + dc] = indexVal;
          }
          placed = true;  // exit the loop after placing
        }
      }
    }
    // (According to problem constraints, `placed` should always become true as all figures will fit.)
  }

  // Print the final grid matrix
  for (let r = 0; r < n; r++) {
    console.log(grid[r]);
  }
  return grid;  // also return the matrix if needed
}

// Example usage:
const n = 4, m = 4;
const figures = ['D', 'B', 'A'];
fillGrid(n, m, figures);
// Expected output (printed matrix):
// [ 1, 2, 2, 2 ]
// [ 1, 1, 3, 0 ]
// [ 1, 4, 4, 0 ]
// [ 0, 4, 4, 0 ]