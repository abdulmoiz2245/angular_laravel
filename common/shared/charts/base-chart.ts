export enum ChartType {
    LINE = 'line',
    PIE = 'pie'
}

export interface ChartConfig {
    selector?: string;
    type: ChartType;
    labels: string[];
    data: number[]|number[][]; // number[] is for type PIE only
    legend?: boolean;
}

export abstract class BaseChart {
    constructor(protected config: ChartConfig) {
        setTimeout(() => this.generate());
    }

    protected abstract generate();

    protected abstract transformChartData();

    protected getMaxValue(): number {
        if ( ! this.config.data) {
            return 0;
        }
        if (Array.isArray(this.config.data[0])) {
            return Math.max(...this.config.data[0] as number[], ...(this.config.data[1] || []) as number[]);
        } else {
            return Math.max(...this.config.data as number[]);
        }
    }

    public isEmpty(): boolean {
        return this.getMaxValue() <= 0;
    }

    public abstract destroy();
}
