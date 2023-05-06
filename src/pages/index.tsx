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
  // let openedCount: number
  // for () {
  //   openedCount = // board
  // }
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

  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (userInputs[j][i] === 1) {
        board[j][i] = 0;
      }
    }
  }

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

  const addZeroAroundZero = (x: number, y: number) => {
    console.log('test');
  };
  const clickCell = (x: number, y: number) => {
    if (!isStarted) {
      console.log('start');
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

  // setBombMap([ →]) * 重複しないよう ランダムに爆弾を生成
  // setUserInputs

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
                  <div className={styles.cell} style={{ backgroundPosition: -30 * (cell - 1) }}>
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
