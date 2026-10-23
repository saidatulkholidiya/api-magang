/// <reference types="jest" />

export type MockRepo = Record<
  | "find"
  | "findOne"
  | "findOneBy"
  | "findAndCount"
  | "create"
  | "save"
  | "merge"
  | "delete"
  | "remove"
  | "createQueryBuilder",
  jest.Mock
>;

export function buatMockRepo(): MockRepo {
  return {
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    merge: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    createQueryBuilder: jest.fn(),
  };
}