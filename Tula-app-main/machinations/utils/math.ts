export const randomDistribution = (value: number, edges: number[]) => {
    let totalWeight = edges.reduce((acc, edge) => acc + edge, 0);
    let probabilities = edges.map(edge => edge / totalWeight);

    let remainingResource = value;
    let distributedResources = Array(edges.length).fill(0);

    for (let i = 0; i < edges.length; i++) {
        let randomAmount = Math.floor(Math.random() * (remainingResource + 1));
        let amountToSend = Math.min(randomAmount, remainingResource * probabilities[i]);
        distributedResources[i] += amountToSend;
        remainingResource -= amountToSend;
    }

    while (remainingResource > 0) {
        let randomIndex = Math.floor(Math.random() * edges.length);
        distributedResources[randomIndex]++;
        remainingResource--;
    }

    distributedResources = distributedResources.map(resource => Math.round(resource));

    return distributedResources;
}

// let value = 10;
// let edges = [1, 2, 3, 1]; // Значения ребер
// let distributedResources = randomDistributionWithProbabilities(value, edges);

// Распределенные ресурсы: [ 2, 2, 3, 2 ]
