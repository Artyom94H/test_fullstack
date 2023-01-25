
class AverageCalculator {
  addNumber(number, list) {
    if (!list.length) {
      list.push({
        id: 1,
        completed: false,
        previous: number,
        current: undefined,
      });
      return;
    }

    const completedLists = list.filter(i => !!i.completed);
    if (completedLists.length === list.length) {
      list.push({
        id: list.length + 1,
        completed: false,
        previous: number,
        current: undefined,
      });
      return list;
    }

    list.map(i => {
      if (!i.completed) {
        if (!i.previous) {
          i.previous = number;
          return;
        }
        if (!i.current) {
          i.current = number;
        }
        i.completed = true;
      }
    });

    return list;
  }

  prepareData (data = []) {
    const prepared = [];
    data.forEach(i => {
      prepared.push({
        ...i,
        average: i.current ? ((i.previous + i.current) / 2).toFixed(2) : i.previous,
      });
    });

    return prepared.sort((a, b) => {
      return b.id - a.id;
    });
  }
}

module.exports = new AverageCalculator();
