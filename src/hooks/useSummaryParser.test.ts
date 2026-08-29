import { renderHook, act } from '@testing-library/react';
import useSummaryParser from './useSummaryParser';

describe('useSummaryParser', () => {
  it('parses medication text into a medication block (FAILING - not implemented yet)', () => {
    const { result } = renderHook(() => useSummaryParser());

    act(() => {
      result.current.parseSummary('Take paracetamol 500mg every 6 hours as needed.');
    });

    // parseSummary currently always produces an empty array — this will fail
    // until real parsing logic is implemented.
    expect(result.current.parsedSummary).not.toEqual([]);
    expect(result.current.parsedSummary?.length).toBeGreaterThan(0);
    expect(result.current.parsedSummary?.[0]).toMatchObject({
      type: 'medication',
      content: expect.stringContaining('paracetamol'),
    });
  });

  it('parses red-flag language into a redFlag block (FAILING - not implemented yet)', () => {
    const { result } = renderHook(() => useSummaryParser());

    act(() => {
      result.current.parseSummary('Call 000 if you experience chest pain or difficulty breathing.');
    });

    const redFlagBlock = result.current.parsedSummary?.find((b) => b.type === 'redFlag');
    expect(redFlagBlock).toBeDefined();
  });

  it('sets an error when input is empty (FAILING - not implemented yet)', () => {
    const { result } = renderHook(() => useSummaryParser());

    act(() => {
      result.current.parseSummary('');
    });

    expect(result.current.error).not.toBeNull();
  });

  it('clears previous error on a successful parse (FAILING - not implemented yet)', () => {
    const { result } = renderHook(() => useSummaryParser());

    act(() => {
      result.current.parseSummary('');
    });
    expect(result.current.error).not.toBeNull();

    act(() => {
      result.current.parseSummary('Take ibuprofen 200mg twice daily with food.');
    });

    expect(result.current.error).toBeNull();
    expect(result.current.parsedSummary?.length).toBeGreaterThan(0);
  });
});
