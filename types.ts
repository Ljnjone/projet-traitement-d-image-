
export enum View {
  DASHBOARD = 'dashboard',
  THEORY = 'theory',
  REGISTRATION = 'registration',
  DETECTION = 'detection'
}

export interface UserProfile {
  id: string;
  name: string;
  photosBase64: string[];
}

export interface RecognitionResult {
  identifiedAs: string | 'unknown';
  confidence: number;
  reasoning: string;
}
