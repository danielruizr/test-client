export interface GameGenre {
  id: string;
  genre: GameGenreEnum;
}

export enum GameGenreEnum {
  Action = 'ACTION',
  Adventure = 'ADVENTURE',
  Board = 'BOARD',
  Card = 'CARD',
  Casual = 'CASUAL',
  Family = 'FAMILY',
  Music = 'MUSIC',
  Puzzle = 'PUZZLE',
  Racing = 'RACING',
  RolePlaying = 'RPG',
  Simulation = 'SIMULATION',
  Sports = 'SPORTS',
  Strategy = 'STRATEGY',
  Trivia = 'TRIVIA',
  Word = 'WORD',
}
