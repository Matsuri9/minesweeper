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

  // let zeroList: { x: number; y: number }[]
  // for () {
  //   zeroList = // board + directions + userInputs + bombMap
  // }
  const openedCount = userInputs.reduce((acc, row) => {
    return (
      acc +
      row.reduce((acc2, val) => {
        return acc2 + (val !== 0 ? 1 : 0);
      }, 0)
    );
  }, 0);
  // const isSuccess = // openedCount + bombCount
  // let isFailure: boolean
  // for () {
  //   isFialure = // userInputs + bombMap
  // }

  let isStarted: boolean;
  if (newUserInputs.some((row: number[]) => row.includes(1))) {
    isStarted = true;
  } else {
    isStarted = false;
  }

  // 表示用ボード設定
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
  // | 9 = flag
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

  const reloadBoard = () => {
    for (let l = 0; l < 9; l++) {
      for (let m = 0; m < 9; m++) {
        if (userInputs[l][m] === 1) {
          if (bombMap[l][m] === 1) {
            board[l][m] = 11;
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

  // 以下実行部分

  reloadBoard();

  const clickCell = (x: number, y: number, event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (userInputs[y][x] !== 0) {
      console.log(board[y][x], userInputs[y][x]);
      return;
    }
    if (!isStarted) {
      for (let i = 0; i < bombCount; i++) {
        setBombRandom(y, x);
      }
    } else {
      // console.log('started');
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
    const newInputs = [...userInputs];
    console.log(y, x, '=');
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

  // const reset = () => ...

  // UseEffect 時計管理
  // - userInputsが1つ以上 → ゲーム中 (時計)
  // - 爆発していたら → ゲーム終了

  return (
    <div className={styles.container}>
      <div className={styles.board}>
        <header className={styles.header}>
          <div className={styles.bombcount} />
          <div className={styles.face} />
          <div className={styles.timercount} />
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

// 評価基準
// ・仕様準拠
// ・useState の数
// ・useEffect 内の行数
// ・計算値の多様
// ・再帰
