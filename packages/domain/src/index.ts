export type {
  AssumptionNote,
  ContextSignal,
  DerivedAnswer,
  SourceReference,
  UserQuestion
} from "./model";
export { mockQuestionText, mockUserQuestion } from "./model";
export { deriveAnswer, normalizeQuestionText } from "./derive";

import { deriveAnswer } from "./derive";
import { mockUserQuestion } from "./model";

export const mockDerivedAnswer = deriveAnswer(mockUserQuestion);
