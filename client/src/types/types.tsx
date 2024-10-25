type Snippet = {
  lang: string;
  code: string;
  filePath: string;
  headerTree: string;
  metaData :{ 
    headerLine: number,
    actualFilePath: string
  }

}

type UserRepoPath = {
  path: string;
  lastIndexed: string
};

export type { Snippet, UserRepoPath};