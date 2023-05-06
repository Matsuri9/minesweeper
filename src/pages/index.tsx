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

  const board: number[][] = [
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1, -1, -1, -1, -1],
  ];

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
  // let isStarted: boolean
  // for () {
  //   isStarted = // userInputs
  // }
  // const board: number[][] = [];

  const addZeroAroundZero = (x: number, y: number) => {
    console.log('test');
  };
  const clickCell = (x: number, y: number) => {
    console.log(x, y);
  };

  // const reset = () => ...

  // クリック時の処理 (clickCell)
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
          {board.map((row: number[], y) =>
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
