// 2048 游戏引擎 — 支持可变尺寸 + 撤回

function createEmptyBoard(size) {
  return Array.from({ length: size }, () => Array(size).fill(0));
}

function getRandomEmptyCell(board, size) {
  const empty = [];
  for (let r = 0; r < size; r++)
    for (let c = 0; c < size; c++)
      if (board[r][c] === 0) empty.push({ row: r, col: c });
  if (empty.length === 0) return null;
  return empty[Math.floor(Math.random() * empty.length)];
}

function randomTileValue() {
  return Math.random() < 0.9 ? 2 : 4;
}

function slideRow(row) {
  let cells = row.filter((v) => v !== 0);
  let score = 0;
  for (let i = cells.length - 1; i > 0; i--) {
    if (cells[i] === cells[i - 1]) {
      cells[i] *= 2;
      score += cells[i];
      cells.splice(i - 1, 1);
      i--;
    }
  }
  while (cells.length < row.length) cells.unshift(0);
  return { row: cells, score };
}

function deepClone(board) {
  return board.map((row) => [...row]);
}

export class GameEngine {
  constructor(size = 4) {
    if (size < 3 || size > 6) size = 4;
    this.size = size;
    this.board = createEmptyBoard(size);
    this.score = 0;
    this.gameOver = false;
    this.won = false;
    this.keepPlaying = false;
    this.history = [];  // 撤回栈: [{board, score}]
    this.steps = 0;
    this.spawnTile();
    this.spawnTile();
  }

  spawnTile() {
    const cell = getRandomEmptyCell(this.board, this.size);
    if (!cell) return false;
    this.board[cell.row][cell.col] = randomTileValue();
    return true;
  }

  move(direction) {
    if (this.gameOver) return false;
    const before = deepClone(this.board);
    const rotated = this.rotateToRight(direction);
    const newRows = [];
    let gained = 0;
    for (const row of rotated) {
      const result = slideRow(row);
      newRows.push(result.row);
      gained += result.score;
    }
    const after = this.rotateBack(newRows, direction);
    const changed = JSON.stringify(before) !== JSON.stringify(after);
    if (!changed) return false;

    // 存档用于撤回
    this.history.push({ board: before, score: this.score });
    if (this.history.length > 100) this.history.shift();

    this.board = after;
    this.score += gained;
    this.steps++;
    this.spawnTile();

    if (!this.won && !this.keepPlaying) {
      for (const row of this.board)
        if (row.includes(2048)) this.won = true;
    }
    this.gameOver = !this.canMove();
    return true;
  }

  undo() {
    if (this.history.length === 0) return false;
    const prev = this.history.pop();
    this.board = prev.board;
    this.score = prev.score;
    this.gameOver = false;
    this.won = false;
    this.steps = Math.max(0, this.steps - 1);
    return true;
  }

  rotateToRight(dir) {
    const b = this.board;
    const s = this.size;
    switch (dir) {
      case 'right': return b.map((r) => [...r]);
      case 'left': return b.map((r) => [...r].reverse());
      case 'up': return b[0].map((_, c) => { const col = []; for (let r = s-1; r >= 0; r--) col.push(b[r][c]); return col; });
      case 'down': return b[0].map((_, c) => { const col = []; for (let r = 0; r < s; r++) col.push(b[r][c]); return col; });
    }
  }

  rotateBack(rows, dir) {
    const s = this.size;
    switch (dir) {
      case 'right': return rows.map((r) => [...r]);
      case 'left': return rows.map((r) => [...r].reverse());
      case 'up': {
        const r = createEmptyBoard(s);
        for (let c = 0; c < s; c++) for (let row = 0; row < s; row++) r[row][c] = rows[c][s-1-row];
        return r;
      }
      case 'down': {
        const r = createEmptyBoard(s);
        for (let c = 0; c < s; c++) for (let row = 0; row < s; row++) r[row][c] = rows[c][row];
        return r;
      }
    }
  }

  canMove() {
    const s = this.size;
    for (let r = 0; r < s; r++)
      for (let c = 0; c < s; c++)
        if (this.board[r][c] === 0) return true;
    for (let r = 0; r < s; r++)
      for (let c = 0; c < s; c++) {
        const v = this.board[r][c];
        if (c < s-1 && v === this.board[r][c+1]) return true;
        if (r < s-1 && v === this.board[r+1][c]) return true;
      }
    return false;
  }

  continueAfterWin() {
    this.keepPlaying = true;
    this.won = false;
  }

  getState() {
    return {
      board: deepClone(this.board),
      score: this.score,
      gameOver: this.gameOver,
      won: this.won,
      keepPlaying: this.keepPlaying,
      steps: this.steps,
      canUndo: this.history.length > 0,
      size: this.size,
    };
  }

  reset(size) {
    if (size && size >= 3 && size <= 6) this.size = size;
    this.board = createEmptyBoard(this.size);
    this.score = 0;
    this.gameOver = false;
    this.won = false;
    this.keepPlaying = false;
    this.history = [];
    this.steps = 0;
    this.spawnTile();
    this.spawnTile();
  }
}
