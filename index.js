import _ from 'lodash';

const makeDataArray = (content) => {
  const strings = content.split('\n').slice(2);
  // prettier-ignore
  const array = strings.map((string) => string
    .split('|')
    .filter((el) => el !== '')
    .map((el) => el.trim()));
  return _.sortBy(array.map(([herb, ...rest]) => [_.capitalize(herb), ...rest]));
};

const getDangerousPercents = (dataArray) => {
  const herbsCount = dataArray.length;
  const dangerous = dataArray.reduce((acc, herbString) => (herbString[herbString.length - 1] === 'Да' ? acc + 1 : acc), 0);
  const notDangerous = herbsCount - dangerous;
  return [`${(dangerous / herbsCount) * 100}%`, `${(notDangerous / herbsCount) * 100}%`];
};

const getAverageLife = (dataArray) => {
  const woodArray = dataArray.filter((herbString) => herbString[1].toLowerCase().includes('леса'));
  // prettier-ignore
  const lifesValues = woodArray
    .map((herbString) => herbString[3])
    .map((el) => el.split(' '))
    .map((el) => {
      const [fromAge, toAge] = el[0].split('-');
      if (toAge) return [fromAge, toAge, el[1]];
      return [fromAge, fromAge, el[1]];
    })
    .map(([from, to, unit]) => {
      if (unit === 'день' || unit === 'дней') return ((Number(from) + Number(to)) / 2) * 365;
      return (Number(from) + Number(to)) / 2;
    })
    .reduce((acc, el) => acc + el, 0) / woodArray.length;
  return Math.round(lifesValues);
};

const getDangerousArea = (dataArray) => {
  const dangAreas = dataArray.filter((herbString) => herbString[herbString.length - 1] === 'Да').map((herbString) => herbString[1]);
  const unicDangAreas = _.union(dangAreas);
  const areasCount = unicDangAreas.reduce((acc, area) => {
    // prettier-ignore
    const curAreaCount = dangAreas
      .reduce((curAcc, curArea) => (curArea === area ? curAcc + 1 : curAcc), 0);
    return [...acc, [area, curAreaCount]];
  }, []);

  const [dangArea] = _.sortBy(areasCount, 1)[areasCount.length - 1];
  return dangArea;
};

export default function solution(content) {
  // BEGIN
  const dataArray = makeDataArray(content);

  const herbsCount = dataArray.length;
  console.log(herbsCount);

  const [dangerousPercent, notDangerousPercent] = getDangerousPercents(dataArray);
  console.log(dangerousPercent);
  console.log(notDangerousPercent);

  const averageLife = getAverageLife(dataArray);
  console.log(averageLife);

  const dangerousArea = getDangerousArea(dataArray);
  console.log(dangerousArea);

  // END
}
