import { AxiosError } from 'axios';
import * as Exceptions from '../exceptions';

export const exceptionsHandler = (dictionary: {
  default: string,
  // TODO: more types here
}) => (
  exception: AxiosError
): never => {
  if (exception.response?.status === 401)
    throw new Exceptions.NotAuthorised;
  else
    throw new Exceptions.Unknown(dictionary.default);
}
