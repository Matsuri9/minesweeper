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
  console.log(openedCount);
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

  // | -1 = 石
  // | 0 = 石なし表示なし
  // | 1~8 = 数字表示
  // | 9 = 石 + はてな
  // | 10 = 石 + 旗
  // | 11 = 爆弾
  const board: number[][] = Array.from({ length: 9 }, () => Array(9).fill(-1));

  const setBombRandom = (x: number, y: number) => {
    const numA = Math.floor(9 * Math.random());
    const numB = Math.floor(9 * Math.random());
    if (numA === x && numB === y) {
      setBombRandom(x, y);
    } else if (bombMap[numA][numB] === 0) {
      bombMap[numA][numB] = 1;
      setBombMap(bombMap);
      console.log('bomb', numA, numB);
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
          console.log('x', l, 'y', m);
          let tempCount = 0;
          for (let n = 0; n < directions.length; n++) {
            const tempX = l + directions[n][0];
            const tempY = m + directions[n][1];
            if (tempX < 0 || tempX > 8 || tempY < 0 || tempY > 8) {
              console.log('[', n, ']', tempX, tempY, '(skip');
              continue;
            }
            console.log('[', n, ']', tempX, tempY);
            if (bombMap[tempX][tempY] === 1) {
              tempCount++;
            }
            console.log(l, m, tempCount);
            board[l][m] = tempCount;
          }
        }
      }
    }
  };

  const addZeroAroundZero = (x: number, y: number) => {
    console.log('test');
  };

  // 以下実行部分

  reloadBoard();

  const clickCell = (x: number, y: number) => {
    if (!isStarted) {
      for (let i = 0; i < bombCount; i++) {
        setBombRandom(y, x);
      }
    } else {
      console.log('started');
    }
    const newInputs = [...userInputs];
    newInputs[y][x] = 1;
    setUserInputs(newInputs);
  };

  // const reset = () => ...

  // UseEffect 時計管理
  // - userInputsが1つ以上 → ゲーム中 (時計)
  // - 爆発していたら → ゲーム終了

  // 計算値
  // is playeing = bool
  // const openedCount = 計算

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
              <div className={styles.cell} key={`${x}-${y}`} onClick={() => clickCell(x, y)}>
                {cell !== 0 && (
                  <div
                    className={styles.cell}
                    style={{ backgroundPosition: -30 * (board[y][x] - 1) }}
                  >
                    {cell === -1 && <div className={styles.stone}>{cell}</div>}
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
