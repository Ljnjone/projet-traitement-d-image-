
export enum View {
  DASHBOARD = 'dashboard',
  THEORY = 'theory',
  REGISTRATION = 'registration',
  DETECTION = 'detection'
}

export interface UserProfile {
  id: string;
  name: string;
  photoBase64: string | null;
}

export interface RecognitionResult {
  identifiedAs: string | 'unknown';
  confidence: number;
  reasoning: string;
}
