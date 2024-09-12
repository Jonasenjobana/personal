/**某审批状态码 */
enum AStatusCode {
  a = 'TJ',
  b = 'SH',
  c = 'TY'
}
/**某状态码 */
enum BStatusCode {
  a = 0,
  b = 1,
  c = 2
}
interface FlowCondition {
  title?: string
  status: string; // 状态
  done?: boolean;
  nextStatuses?: string[];
  children?: FlowCondition[];
  preStatus?: FlowCondition[];
  toNext?: () => string;
}
export class FlowStrategy<T> {
  /**流程 */
  flowCondition: FlowCondition[];
  constructor(public status: T) {}
  setFlow(flowCondition: FlowCondition[]) {
    this.flowCondition = flowCondition;
  }
  nextFlow(staus: T = this.status) {
    const condition = this.getCondition();
    return condition.toNext && condition.toNext() || condition.nextStatuses[0]
  }
  getCondition() {
    return this.flowCondition[0]
  }
}
export const AFlowCondition: FlowCondition[] = [
  {
    status: '0',
    nextStatuses: ['1']
  },
  {
    status: '1',
    nextStatuses: ['2', '3'],
    toNext: () => {
      if (1 < 2) return '2';
      return '3'
    }
  },
  {
    status: '2',
    nextStatuses: ['3']
  },
  {
    status: '3'
  }
];
