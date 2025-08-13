import { healthCheck } from '../health-check';

describe('healthCheck', () => {
  it('Should check server health and return true indicating a healthy server', () => {
    expect(healthCheck()).toBeTruthy();
  });
});
