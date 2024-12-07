const mockDispatch = jest.fn();
const mockSelector = jest.fn();

export const useDispatch = () => mockDispatch;
export const useSelector = (selector: any) => mockSelector(selector);

// Reset all mocks between tests
beforeEach(() => {
  mockDispatch.mockClear();
  mockSelector.mockClear();
});

export { mockDispatch, mockSelector };
