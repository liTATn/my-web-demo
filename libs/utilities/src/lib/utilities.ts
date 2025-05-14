/**
 * generateRandomNumber
 * @param min the minimum number to generate
 * @param max the maximum number to generate
 * @returns a random number between min and max
 * @example
 * const randomNumber = generateRandomNumber(1, 10);
 * console.log(randomNumber); // 5
 */
export function generateRandomNumber(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * generateRandomNumbers
 * @description generate a list of random numbers
 * @param count the number of random numbers to generate
 * @param min the minimum number to generate
 * @param max the maximum number to generate
 * @param noRepeat whether to generate unique random numbers
 * @returns a list of random numbers
 * @example
 * const randomNumbers = generateRandomNumbers(5, 1, 10);
 * console.log(randomNumbers); // [5, 2, 8, 1, 9]
 */
export function generateRandomNumbers(count: number, min: number, max: number,noRepeat = false) {
  if (noRepeat) {
    if (count > max - min + 1) {
      throw new Error('Count is greater than the range of numbers');
    }
    const uniqueNumbers = new Set<number>();
    while (uniqueNumbers.size < count) {
      const randomNumber = generateRandomNumber(min, max);
      uniqueNumbers.add(randomNumber);
    }
    return Array.from(uniqueNumbers);
  }
  const numbers = [];
  while (numbers.length < count) {
    const randomNumber = generateRandomNumber(min, max);
    numbers.push(randomNumber);
  }
  return numbers;
}
/**
 * randomOrder
 * @param array the array to shuffle
 * @description shuffle the array
 * @returns a shuffled array
 * @example
 * const array = [1, 2, 3, 4];
 * const shuffledArray = randomOrder(array);
 * console.log(shuffledArray); // [3, 1, 4, 2]
 */
export function randomOrder<T>(array: T[]) {
  const shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j = generateRandomNumber(0, i);
    [shuffledArray[i], shuffledArray[j]] = [
      shuffledArray[j],
      shuffledArray[i],
    ];
  }
  return shuffledArray;
}