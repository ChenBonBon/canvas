import { Binding, Link, Panel, Point, Shape, Size, Spot, TextBlock } from 'gojs';
import { GraphConfig } from '../constant';
import { LabelDesign, TransitionKind } from '../design';
import { specificLabelNameBinding, specificLabelSegmentOffsetBinding, specificLabelTextBinding } from './Bindings';

export const tempCommonLink = new Link({
  routing: Link.AvoidsNodes,
})
  .add(new Shape({ strokeDashArray: GraphConfig.DASH_ARRAY }))
  .add(new Shape({ toArrow: 'Triangle' }));

// 普通连接线，支持：连接到其他 修改转折点 修改路径 重新连接到其他 重新被其他连接 TODO 尝试 LinkReshapingTool 解决自定义转折点的问题
export const commonLink = () =>
  new Link({
    routing: Link.AvoidsNodes,
    curve: Link.JumpOver,
    reshapable: true,
    resegmentable: true,
    relinkableFrom: true,
    relinkableTo: true,
  })
    .bind(new Binding('points', 'routingPoints').makeTwoWay())
    .add(new Shape({ strokeWidth: 2 }))
    .add(
      new TextBlock({
        editable: false,
        stroke: '#304FFE',
        cursor: 'text',
        alignmentFocus: Spot.Left,
        segmentIndex: 0,
        segmentFraction: 0.4,
        segmentOffset: new Point(0, -10),
      })
        .bind(specificLabelTextBinding(LabelDesign.SIM_VALUE))
        .bind(specificLabelNameBinding(LabelDesign.SIM_VALUE))
    );

export namespace LinkTemplate {
  export const thenLink = () =>
    new Link({
      reshapable: false,
      relinkableFrom: false,
      relinkableTo: false,
      selectable: false,
      fromSpot: Spot.RightSide,
      routing: Link.Normal,
    })
      .add(new Shape({ strokeWidth: 2 }))
      .add(new Shape({ toArrow: 'Triangle' }))
      //在线的开头部分设置文本框
      .add(
        new TextBlock({
          editable: true,
          stroke: 'Black',
          //background: 'lightblue',
          segmentIndex: 0,
          segmentOffset: new Point(15, NaN),
          segmentOrientation: Link.OrientUpright,
        }).bind(new Binding('text', 'targetObjectLabel').makeTwoWay())
      );

  export const elseLink = () =>
    new Link({
      reshapable: false,
      relinkableFrom: false,
      relinkableTo: false,
      selectable: false,
      routing: Link.Orthogonal,
      curve: Link.JumpOver,
    })

      .add(
        new Shape({
          stroke: 'black',
          isPanelMain: true,
          strokeWidth: 2,
        }).bind(new Binding('stroke', 'isHighlighted', (h) => (h ? 'magenta' : 'black')).ofObject())
      )
      .add(new Shape({ toArrow: 'Triangle' }));

  export const whenInner = thenLink;
  export const whenOuter = elseLink;

  export const transition = () =>
    new Link({
      curve: Link.Bezier,
      reshapable: true,
      adjusting: Link.Scale,
      fromEndSegmentLength: 30,
      toEndSegmentLength: 30,
    })
      .bind(new Binding('points', 'routingPoints'))
      .bind(
        new Binding('curve', '', (edge) => {
          return edge.style.polyline ? Link.None : Link.Bezier;
        })
      )
      // 不需要对状态机的连线绑定这两个数据
      // .bind(new Binding('fromSpot', 'fromSpot', Spot.parse).makeTwoWay(Spot.stringify))
      // .bind(new Binding('toSpot', 'toSpot', Spot.parse).makeTwoWay(Spot.stringify))
      .add(
        new Shape({ stroke: 'black', strokeWidth: 2 }).bind(
          new Binding('stroke', 'isHighlighted', (h) => (h ? 'magenta' : 'black')).ofObject()
        )
      )
      .add(new Shape({ toArrow: 'Triangle' }))
      //定义头部的装饰
      .add(
        new Shape({
          strokeWidth: 1.5,
          fromArrow: 'Circle',
          segmentOffset: new Point(-7, 0),
          fill: 'red',
        })
          .bind('visible', 'style', (x) => x.kind !== null && x.kind !== TransitionKind.Weak)
          .bind('fill', 'style', (x) => (x.kind === TransitionKind.Strong ? 'red' : 'lightgreen'))
          .bind('fromArrow', 'style', (x) => (x.kind === TransitionKind.Strong ? 'Circle' : 'Triangle'))
          .bind('segmentOffset', 'style', (x) =>
            x.kind === TransitionKind.Strong ? new Point(-7, 0) : new Point(-1, 0)
          )
      )
      //定义优先级的装饰
      .add(
        new Shape('Ellipse', {
          fill: 'white',
          width: 15,
          height: 15,
          segmentIndex: 0,
          segmentFraction: 0.25,
        })
      )
      .add(
        new TextBlock({
          font: '10px sans-serif',
          textAlign: 'center',
          segmentIndex: 0,
          segmentFraction: 0.25,
        }).bind(specificLabelTextBinding('PRIORITY'))
      )
      //定义尾部的两个装饰

      .add(
        new Shape({
          toArrow: 'History',
          stroke: 'transparent',
          strokeWidth: 1.5,
          geometryString:
            'FM0.5 10a9.5 9.5 0 0 1 9.5 -9.5h0a9.5 9.5 0 0 1 9.5 9.5v0a9.5 9.5 0 0 1 -9.5 9.5h0a9.5 9.5 0 0 1 -9.5 -9.5 ',
          fill: 'black',
        })
          .bind('visible', 'style', (x) => x.history === 'resume')
          .bind('segmentOffset', 'style', (x) => (x.kind === TransitionKind.Weak ? new Point(-10, 0) : new Point(9, 0)))
      )
      .add(
        new Shape({
          toArrow: 'History',
          stroke: 'White',
          strokeWidth: 1.5,
          geometryString: ' M7 5v10M13 5v10 x M7 10h6M16 5v2',
        })
          .bind('visible', 'style', (x) => x.history === 'resume')
          .bind('segmentOffset', 'style', (x) =>
            x.kind === TransitionKind.Weak ? new Point(-14, 0) : new Point(5.5, 0)
          )
      )
      .add(
        new Shape({
          toArrow: 'Circle',
          segmentOffset: new Point(7, 0),
          fill: '#00ebff',
          strokeWidth: 1.5,
        }).bind('visible', 'style', (x) => x.kind === TransitionKind.Weak)
      )
      // 定义label
      .add(
        new Panel('Horizontal', {
          cursor: 'move',
          background: 'transparent',
        })
          .add(
            new TextBlock({
              editable: true,
              stroke: 'blue',
              cursor: 'text',
            })
              .bind(specificLabelTextBinding('CONDITION'))
              .bind(specificLabelNameBinding('CONDITION'))
          )
          .add(
            new Shape('Line2', {
              height: 10,
              width: 10,
              stroke: 'gray',
              margin: 5,
            })
          )
          .add(
            new TextBlock({
              editable: true,
              stroke: 'gray',
              cursor: 'text',
              minSize: new Size(20, 10),
            })
              .bind(specificLabelTextBinding('ACTION'))
              .bind(specificLabelNameBinding('ACTION'))
          )
          .bind(specificLabelSegmentOffsetBinding('CONDITION'))
          .bind(specificLabelNameBinding('CONDITION'))
      );
}
