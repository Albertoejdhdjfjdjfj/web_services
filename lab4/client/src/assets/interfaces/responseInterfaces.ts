export interface ResponseMessage {
  message: string;
}

export interface TokensData {
  accessToken:string,
  refreshToken:string
}

export interface Book {
  _id: string;
  name: string;
  author: string;
  length: number;
  released: number;
  description: string;
  imageUrl: string;
  rating: {
    numRatings: number;
    points: number;
  };
}

export interface Status {
  status: string;
}
