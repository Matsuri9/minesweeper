import type { MouseEvent } from 'react';
import { useState } from 'react';
import styles from './index.module.css';

const Home = () => {
  // pretier-ignore

  const directions = [
    [-1, 0],
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
  ];
  const bombCount = 10;

  const [userInputs, setUserInputs] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);
  const [bombMap, setBombMap] = useState([
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]);

  const newUserInputs: number[][] = JSON.parse(JSON.stringify(userInputs));

  let openedCount = 0;
  for (let l = 0; l < 9; l++) {
    for (let m = 0; m < 9; m++) {
      if (userInputs[l][m] === 1) {
        openedCount++;
      }
    }
  }

  // [GameState]
  // | 0 : スタート前
  // | 1 : ゲーム中
  // | 2 : ゲーム終了(クリア)
  // | 3 : ゲーム終了(爆発)
  let gameState: 0 | 1 | 2 | 3 = 0;

  let isStarted: boolean;
  if (newUserInputs.some((row: number[]) => row.includes(1))) {
    isStarted = true;
    gameState = 1;
  } else {
    isStarted = false;
  }

  // [board]
  // | -1 = 石
  // | 0 = 石なし表示なし
  // | 1~8 = 数字表示
  // | 9 = 石 + はてな
  // | 10 = 石 + 旗
  // | 11 = 爆弾
  // [userInput]
  // | 0 = default
  // | 1 = clicked
  // | 9 = question
  // | 10 = flag
  // | 11 = bomb
  const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(-1));

  const setBombRandom = (x: number, y: number) => {
    const numA = Math.floor(9 * Math.random());
    const numB = Math.floor(9 * Math.random());
    if (numA === x && numB === y) {
      setBombRandom(x, y);
    } else if (bombMap[numA][numB] === 0) {
      bombMap[numA][numB] = 1;
      setBombMap(bombMap);
    } else {
      setBombRandom(x, y);
    }
  };

  const openNearTile = (x: number, y: number) => {
    const tempInputs: number[][] = Array.from({ length: 9 }, () => Array(9).fill(0));
    const nearBombCount = board[x][y];
    let nearFlagCount = 0;
    for (let i = 0; i < 8; i++) {
      const tempX = x + directions[i][0];
      const tempY = y + directions[i][1];
      if (tempX < 0 || tempX > 8 || tempY < 0 || tempY > 8) {
        continue;
      }
      if (userInputs[tempX][tempY] === 10) {
        nearFlagCount++;
      } else if (userInputs[tempX][tempY] === 0) {
        tempInputs[tempX][tempY] = 1;
      }
    }

    if (nearBombCount !== nearFlagCount) {
      return;
    }
    const newInputs = [...userInputs];
    for (let l = 0; l < 9; l++) {
      for (let m = 0; m < 9; m++) {
        if (tempInputs[l][m] === 1) {
          newInputs[l][m] = 1;
        }
        setUserInputs([...newInputs]);
        reloadBoard();
      }
    }
    for (let l = 0; l < 9; l++) {
      for (let m = 0; m < 9; m++) {
        if (board[l][m] === 0) {
          addZeroAroundZero(l, m);
        }
      }
    }
  };

  const endGameByRefuse = () => {
    if (openedCount === 81 - bombCount) {
      // 改編の余地あり
      gameState = 2;
      console.log('log> game end (by refused)');
    }
  };

  const endGameByBomb = () => {
    gameState = 3;
    console.log('log> game end (by exploded)');
  };

  const reloadBoard = () => {
    for (let l = 0; l < 9; l++) {
      for (let m = 0; m < 9; m++) {
        if (userInputs[l][m] === 1) {
          if (bombMap[l][m] === 1) {
            board[l][m] = 11;
            endGameByBomb();
            continue;
          }
          if (userInputs[l][m] === 9) {
            board[l][m] = 9;
            continue;
          } else if (userInputs[l][m] === 10) {
            board[l][m] = 10;
            continue;
          }
          let tempCount = 0;
          for (let n = 0; n < directions.length; n++) {
            const tempX = l + directions[n][0];
            const tempY = m + directions[n][1];
            if (tempX < 0 || tempX > 8 || tempY < 0 || tempY > 8) {
              continue;
            }
            if (bombMap[tempX][tempY] === 1) {
              tempCount++;
            }
            board[l][m] = tempCount;
          }
        }
      }
    }
    endGameByRefuse();
  };

  const addZeroAroundZero = (x: number, y: number) => {
    const checkAround = (x: number, y: number) => {
      if (board[x][y] === 0) {
        for (let i = 0; i < directions.length; i++) {
          const checkX = x + directions[i][0];
          const checkY = y + directions[i][1];
          if (checkX < 0 || checkX > 8 || checkY < 0 || checkY > 8) {
            continue;
          }
          if (newInputs[checkX][checkY] === 0) {
            if (bombMap[checkX][checkY] === 0) {
              newInputs[checkX][checkY] = 1;
              reloadBoard();
              checkAround(checkX, checkY);
            }
          }
        }
      }
    };

    if (bombMap[x][y] === 1) return;
    const newInputs = [...userInputs];

    checkAround(x, y);

    setUserInputs([...newInputs]);
  };

  const clickCell = (x: number, y: number, event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (userInputs[y][x] === 9 || userInputs[y][x] === 10 || gameState === 2 || gameState === 3) {
      return;
    }
    if (userInputs[y][x] === 1) {
      openNearTile(y, x);

      return;
    }
    if (!isStarted) {
      console.log('log> game started');
      for (let i = 0; i < bombCount; i++) {
        setBombRandom(y, x);
      }
    }
    const newInputs = [...userInputs];
    newInputs[y][x] = 1;
    setUserInputs(newInputs);
    reloadBoard();
    if (board[y][x] === 0) {
      addZeroAroundZero(y, x);
    }
  };

  const rightClickCell = (x: number, y: number, event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (gameState === 2 || gameState === 3) {
      return;
    }
    const newInputs = [...userInputs];
    if (userInputs[y][x] === 10) {
      newInputs[y][x] = 9;
      setUserInputs(newInputs);
      reloadBoard();
      return;
    } else if (userInputs[y][x] === 9) {
      newInputs[y][x] = 0;
      setUserInputs(newInputs);
      reloadBoard();
      return;
    } else if (userInputs[y][x] !== 0) {
      return;
    }
    newInputs[y][x] = 10;
    setUserInputs(newInputs);
    reloadBoard();
  };

  reloadBoard();

  const reset = () => {
    setUserInputs([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    setBombMap([
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);
    console.log('log> game reset');
    gameState = 0;
  };

  // UseEffect 時計管理
  // - userInputsが1つ以上 → ゲーム中 (時計)
  // - 爆発していたら → ゲーム終了

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <header className={styles.header}>
          <button
            className={styles['reset-button']}
            onClick={reset}
            style={{ backgroundPosition: gameState === 0 ? -408 : -370 - 38 * gameState }}
          />
        </header>
        <div className={styles.main}>
          {board.map((row, y) =>
            row.map((cell, x) => (
              <div
                className={styles.cell}
                key={`${x}-${y}`}
                onClick={(event) => clickCell(x, y, event)}
                onContextMenu={(event) => rightClickCell(x, y, event)}
              >
                {cell !== 0 && (
                  <div
                    className={styles.tile}
                    style={{ backgroundPosition: -30 * (board[y][x] - 1) }}
                  >
                    {cell === 0 && <div className={styles.tile} />}
                    {(userInputs[y][x] === 0 ||
                      userInputs[y][x] === 9 ||
                      userInputs[y][x] === 10) && (
                      <div className={styles.stone}>
                        {(userInputs[y][x] === 9 || userInputs[y][x] === 10) && (
                          <div
                            className={styles.flag}
                            style={{ backgroundPosition: -30 * (userInputs[y][x] - 1) }}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
