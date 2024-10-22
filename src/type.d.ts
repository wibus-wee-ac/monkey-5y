interface TempStore {
  lessions: {
    // 章节，名字，id，视频播放进度
    [key: string]: {
      name: string;
      id: string;
      progress: number;
    };
  };
}


declare global {
  interface Window {
    __5yAutoStudy__: {
      tempStore: TempStore;
    };
  }
}

export {};