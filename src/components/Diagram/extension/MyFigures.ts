/*   SMAVE Figures **/

/* eslint-disable */
import * as go from "gojs";
import { NodeDesign, ShapeDesign } from "../design";

const KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);

//create
defineFigureByPath("Input", "m0 0 12 15.7449L0 32", 12, 32);
defineFigureByPath("Output", "m8 0 12 15.7449L8 32M0 16h12", 20, 32);

go.Shape.defineFigureGenerator("Probe", (shape, w, h) => {
  return new go.Geometry().add(
    new go.PathFigure(0, 0)
      .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.4 * h))
      .add(new go.PathSegment(go.PathSegment.Line, w, 0))
      .add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.4 * h))
      .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
      .add(new go.PathSegment(go.PathSegment.Move, 0.5 * w, 0.71 * h))
      .add(new go.PathSegment(go.PathSegment.Line, 0, 0.71 * h))
  );
});

go.Shape.defineFigureGenerator("LocalVariableIn", (shape, w, h) => {
  return new go.Geometry().add(
    new go.PathFigure(0.5 * w, 0.5 * h)
      .add(new go.PathSegment(go.PathSegment.Line, 0, h))
      .add(new go.PathSegment(go.PathSegment.Line, 0, 0))
      .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
      .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
      .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
  );
});

go.Shape.defineFigureGenerator("LocalVariableOut", (shape, w, h) => {
  return new go.Geometry().add(
    new go.PathFigure(0.5 * w, 0.5 * h)
      .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, h))
      .add(new go.PathSegment(go.PathSegment.Line, w, 0.5 * h))
      .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0))
      .add(new go.PathSegment(go.PathSegment.Line, 0.5 * w, 0.5 * h))
      .add(new go.PathSegment(go.PathSegment.Line, 0, 0.5 * h))
  );
});

go.Shape.defineFigureGenerator("Terminator", "XLine");

go.Shape.defineFigureGenerator("VirtualGroup", (shape, w, h) => {
  let param1 = 10;
  param1 = Math.min(param1, w / 3);
  param1 = Math.min(param1, h / 3);

  const cpOffset = param1 * KAPPA;
  const geo = new go.Geometry().add(
    new go.PathFigure(param1, 0, true)
      .add(new go.PathSegment(go.PathSegment.Line, w - param1, 0))
      .add(
        new go.PathSegment(
          go.PathSegment.Bezier,
          w,
          param1,
          w - cpOffset,
          0,
          w,
          cpOffset
        )
      )
      .add(new go.PathSegment(go.PathSegment.Line, w, h - param1))
      .add(
        new go.PathSegment(
          go.PathSegment.Bezier,
          w - param1,
          h,
          w,
          h - cpOffset,
          w - cpOffset,
          h
        )
      )
      .add(new go.PathSegment(go.PathSegment.Line, param1, h))
      .add(
        new go.PathSegment(
          go.PathSegment.Bezier,
          0,
          h - param1,
          cpOffset,
          h,
          0,
          h - cpOffset
        )
      )
      .add(new go.PathSegment(go.PathSegment.Line, 0, param1))
      .add(
        new go.PathSegment(
          go.PathSegment.Bezier,
          param1,
          0,
          0,
          cpOffset,
          cpOffset,
          0
        ).close()
      )
  );
  if (cpOffset > 1) {
    geo.spot1 = new go.Spot(0, 0, cpOffset, cpOffset);
    geo.spot2 = new go.Spot(1, 1, -cpOffset, -cpOffset);
  }
  return geo;
});
go.Shape.defineFigureGenerator("RoundedTopRectangle", function (shape, w, h) {
  // this figure takes one parameter, the size of the corner
  var p1 = 5; // default corner size
  if (shape !== null) {
    var param1 = shape.parameter1;
    if (!isNaN(param1) && param1 >= 0) p1 = param1; // can't be negative or NaN
  }
  p1 = Math.min(p1, w / 3); // limit by width & height
  p1 = Math.min(p1, h);
  var geo = new go.Geometry();
  // a single figure consisting of straight lines and quarter-circle arcs
  geo.add(
    new go.PathFigure(0, p1)
      .add(new go.PathSegment(go.PathSegment.Arc, 180, 90, p1, p1, p1, p1))
      .add(new go.PathSegment(go.PathSegment.Line, w - p1, 0))
      .add(new go.PathSegment(go.PathSegment.Arc, 270, 90, w - p1, p1, p1, p1))
      .add(new go.PathSegment(go.PathSegment.Line, w, h))
      .add(new go.PathSegment(go.PathSegment.Line, 0, h).close())
  );
  // don't intersect with two top corners when used in an "Auto" Panel
  geo.spot1 = new go.Spot(0, 0, 0.3 * p1, 0.3 * p1);
  geo.spot2 = new go.Spot(1, 1, -0.3 * p1, 0);
  return geo;
});

go.Shape.defineFigureGenerator(
  "RoundedBottomRectangle",
  function (shape, w, h) {
    // this figure takes one parameter, the size of the corner
    var p1 = 5; // default corner size
    if (shape !== null) {
      var param1 = shape.parameter1;
      if (!isNaN(param1) && param1 >= 0) p1 = param1; // can't be negative or NaN
    }
    p1 = Math.min(p1, w / 3); // limit by width & height
    p1 = Math.min(p1, h);
    var geo = new go.Geometry();
    // a single figure consisting of straight lines and quarter-circle arcs
    geo.add(
      new go.PathFigure(0, 0)
        .add(new go.PathSegment(go.PathSegment.Line, w, 0))
        .add(new go.PathSegment(go.PathSegment.Line, w, h - p1))
        .add(
          new go.PathSegment(go.PathSegment.Arc, 0, 90, w - p1, h - p1, p1, p1)
        )
        .add(new go.PathSegment(go.PathSegment.Line, p1, h))
        .add(
          new go.PathSegment(
            go.PathSegment.Arc,
            90,
            90,
            p1,
            h - p1,
            p1,
            p1
          ).close()
        )
    );
    // don't intersect with two bottom corners when used in an "Auto" Panel
    geo.spot1 = new go.Spot(0, 0, 0.3 * p1, 0);
    geo.spot2 = new go.Spot(1, 1, -0.3 * p1, -0.3 * p1);
    return geo;
  }
);

//Port
go.Shape.defineFigureGenerator(NodeDesign.leftPort, "LineH");
go.Shape.defineFigureGenerator(NodeDesign.rightPort, "LineH");
go.Shape.defineFigureGenerator(NodeDesign.topPort, "LineV");
go.Shape.defineFigureGenerator(NodeDesign.defaultPort, "XLine");

go.Shape.defineFigureGenerator(ShapeDesign.RV_LINE, "RoundedRectangle");

go.Shape.defineFigureGenerator(ShapeDesign.OPERATOR_UNDEFINED, "Rectangle");

go.Shape.defineArrowheadGeometry(
  "History",
  "F1 m 8,4 b 0 360 -4 0 4 z" + "M 2,2 l 0,4" + "M 2,4 l 4,0" + "M 6,2 l 0,4"
);

function defineFigureByPath(
  name: string,
  pathStr: string,
  ww = 100,
  hh = 100,
  filled = false
) {
  go.Shape.defineFigureGenerator(name, (shape, w, h) => {
    var geometry = go.Geometry.parse(pathStr, filled);
    return geometry.scale(w / ww, h / hh);
  });
}

//create
defineFigureByPath(
  NodeDesign.signal + "Node",
  "M 0 0 h50 v100 h-50 l20 -50 l-20 -50",
  50,
  100
);
defineFigureByPath(
  NodeDesign.signalEmit,
  "Fm24.2221 0 11.5171 14.9602L24.2206 30H0V0h24.2221ZM18.0358-.3333 29 14.9297 18 30.3335M5.3549 7.0467 10.3658.7439l5.011 6.3027",
  34,
  29
);
defineFigureByPath(
  NodeDesign.assume + "Node",
  "M0 14.7368 10.5117 28 22.7366 0H32",
  32,
  30
);
defineFigureByPath(
  NodeDesign.guarantee + "Node",
  "M32 14.7368 21.4883 28 9.2634 0H0",
  32,
  30
);
//case
defineFigureByPath(
  NodeDesign.ifThenElse,
  "M0 10 h10 v30 h-10 v-30 M0 60" +
    "M0 60 h10 v30 h-10 v-30" +
    "M90 35 h10 v30 h-10 v-30" +
    "M10 75 L90 50"
);
defineFigureByPath(NodeDesign.caseOp, "M75 0 L100 50 M75 100 L100 50");
//stru / array
defineFigureByPath(
  NodeDesign.dataStructureNode,
  "FM0 0h46v46H0z M35 12.0812h6v26h-6M31 17.9959h6M31 24.5h6M31 31.5h6",
  46,
  46
);
defineFigureByPath(
  NodeDesign.dataArrayNode,
  "FM0 0h46v46H0zM35 12.0812h6v26h-6M5 14h10v5H5zM5 32h10v5H5zM5 23h10v5H5z",
  46,
  46
);
defineFigureByPath(
  NodeDesign.scalarToVectorNode,
  "FM0 0h46v46H0zM31 12.0812h10v17H31M5 17h10v7H5z",
  46,
  46
);
defineFigureByPath(
  NodeDesign.slice + "Node",
  "FM0 0h46v46H0z x" +
    "M37 12h4v17h-4M33 12h2m0 17h-2M29 12h2m0 17h-2M25 12h2m0 17h-2M21 12h2m0 17h-2M17 12h2m0 17h-2M13 12h2m0 17h-2M9 12H5v17h4",
  46,
  46
);
defineFigureByPath(
  NodeDesign.concatenation + "Node",
  "FM0 0h46v46H0z x" + "M33 12h8v26h-8M15 22H5V12h10M15 38H5V28h10",
  46,
  46
);
defineFigureByPath(
  NodeDesign.reverse + "Node",
  "FM0 0h46v46H0z x" +
    "M34 13h8v26h-8M14 13H6v26h8M27 16h5v5z" +
    "M27 36h5v-5zm-11.0418301 -19.0366378 14.9899594 18.0049253 M31.0317899 17.0366378 16.0418305 35.0415631",
  46,
  46
);
defineFigureByPath(
  NodeDesign.transpose + "Node",
  "FM0 0h46v46H0z x" +
    "M9 12H5v17h4M17.2573859 16v-4h24v4M12.0185601 29.0280506h15c2.7614237 0 5-2.2385763 5-5v-6" +
    "m-3.50148385 2.29939439 3.53680896-3.53680896 3.5355339 3.5355339z",
  46,
  46
);
defineFigureByPath(
  NodeDesign.prjDyn,
  "FM0 0h46v46H0z x" + "M15 12H5v17h10M33 15h8v11h-8z",
  46,
  46
);
defineFigureByPath(
  NodeDesign.projection + "Node",
  "FM0 0h46v46H0z x" + "M15 12H5v17h10M33 12h8v17h-8z",
  46,
  46
);
defineFigureByPath(NodeDesign.make + "Node", "FM0 0h46v46H0", 46, 46);
defineFigureByPath(NodeDesign.flatten + "Node", "FM47 0H0v46h47", 46, 46);
defineFigureByPath(
  NodeDesign.chgIth,
  "FM0 0h46v46H0z x M15 12H5v8h10M31 12h10v17H31M5 24h9v5H5z",
  46,
  46
);

defineFigureByPath(
  NodeDesign.plusNAryNode,
  "FM0 0h46v46H0zM4 16.5h11M4 32.5h11M9.5 11v11M9.5 27v11",
  46,
  46
); //M5 5h46v46H5zM9 21.5h11M9 37.5h11M14.5 16v11M14.5 32v11
defineFigureByPath(
  NodeDesign.minusNAryNode,
  "FM0 0h46v46H0zM4 16.5h11M4 32.5h11M9.5 11v11",
  46,
  46
);
defineFigureByPath(
  NodeDesign.multiNAryNode,
  "FM0 0h46v46H0zM10.02 34.0453 27.0347 17.037M10.02 17.037l17.0146 17.0083",
  46,
  46
);
defineFigureByPath(
  NodeDesign.polymorphicAryNode,
  "FM0 0h46v46H0zM10.0201 34.0453l17.0144-17.0084",
  46,
  46
);
defineFigureByPath(
  NodeDesign.moduloAryNode,
  "FM0 0h46v46H0z M15.0605 23h-1.3828v-5.4375c0-.4453.0274-.9902.082-1.6348h-.0234c-.086.3672-.162.6309-.2285.791L11 23h-.961l-2.5136-6.2344c-.0703-.1836-.1445-.4629-.2227-.8379h-.0234c.0312.336.0469.8848.0469 1.6465V23h-1.289v-8.4023H8l2.209 5.5957c.168.4296.2773.75.3281.9609h.0293c.1445-.4414.2617-.7695.3516-.9844l2.25-5.5722h1.8925V23ZM20.7651 23.1406c-1.211 0-2.1806-.3926-2.9091-1.1777-.7286-.7852-1.0928-1.8067-1.0928-3.0645 0-1.3515.371-2.4297 1.1133-3.2343.7421-.8047 1.75-1.207 3.0234-1.207 1.1797 0 2.1299.3906 2.8506 1.1718.7207.7813 1.081 1.8027 1.081 3.0645 0 1.371-.3691 2.455-1.1074 3.252-.7383.7968-1.7246 1.1952-2.959 1.1952Zm.0645-7.459c-.7695 0-1.3955.2871-1.878.8614-.4824.5742-.7236 1.33-.7236 2.2675 0 .9336.2344 1.6856.7031 2.256.4688.5702 1.082.8554 1.8399.8554.8047 0 1.4394-.2715 1.9043-.8145.4648-.543.6973-1.3027.6973-2.2793 0-1.0039-.2256-1.7793-.6768-2.3261-.4512-.547-1.0732-.8204-1.8662-.8204ZM26.5459 23v-8.4023h2.4258c3.0976 0 4.6465 1.3652 4.6465 4.0957 0 1.2968-.4297 2.3388-1.2891 3.126-.8594.787-2.0117 1.1806-3.457 1.1806h-2.3262Zm1.3887-7.2188v6.041h1.1132c.9805 0 1.7432-.2695 2.2881-.8085.545-.539.8174-1.3008.8174-2.2852 0-1.9648-1.0176-2.9473-3.0527-2.9473h-1.166Z",
  46,
  46
);
defineFigureByPath(
  NodeDesign.unaryMinusNAryNode,
  "FM0 0h46v46H0zM4.0308 20H23",
  46,
  46
);
defineFigureByPath(
  NodeDesign.numericCastOp,
  "FM0 0h46v46H0zM11.8965 22.6484c-.6328.3282-1.42.4922-2.3613.4922-1.2188 0-2.1954-.3847-2.9297-1.1543-.7344-.7695-1.1016-1.7793-1.1016-3.0293 0-1.3437.413-2.4297 1.2393-3.2578.8261-.8281 1.87-1.2422 3.1318-1.2422.8125 0 1.4863.1153 2.0215.3457v1.3828c-.5664-.3359-1.1914-.5039-1.875-.5039-.9102 0-1.6475.291-2.212.873-.5644.5821-.8466 1.3595-.8466 2.3321 0 .9258.2637 1.6631.791 2.212.5273.5488 1.2207.8232 2.08.8232.793 0 1.4806-.1875 2.0626-.5625v1.289ZM20.566 23h-1.5294l-.7558-2.1387H14.976L14.2495 23h-1.5234l3.1465-8.4023h1.5703L20.5659 23Zm-2.6544-3.2754-1.166-3.3516c-.0352-.1093-.0723-.2851-.1113-.5273h-.0235c-.0351.2227-.0742.3984-.1172.5273l-1.1543 3.3516h2.5723ZM21.5068 22.666v-1.4355c.129.1172.2822.2226.46.3164.1777.0937.3662.1728.5654.2373a4.456 4.456 0 0 0 .5977.1494c.1992.0351.3828.0527.5508.0527.5859 0 1.0224-.0976 1.3095-.293.2871-.1953.4307-.4785.4307-.8496 0-.1992-.0479-.372-.1436-.5185-.0957-.1465-.2295-.2803-.4013-.4014-.172-.121-.374-.2373-.6065-.3486a43.5966 43.5966 0 0 0-.747-.3486 12.3053 12.3053 0 0 1-.797-.463c-.246-.1562-.4599-.329-.6415-.5185a2.1696 2.1696 0 0 1-.4278-.6416c-.1035-.2383-.1552-.5176-.1552-.8379 0-.3945.0888-.7373.2666-1.0283.1777-.291.412-.5312.703-.7207.2911-.1895.6222-.33.9933-.4219.371-.0918.75-.1377 1.1367-.1377.8789 0 1.5195.0996 1.9218.2989v1.377c-.4765-.3438-1.0898-.5157-1.8398-.5157-.207 0-.413.0195-.6182.0586-.205.039-.3886.1035-.5507.1933-.1622.0899-.294.2051-.3955.3457-.1016.1407-.1524.3106-.1524.5098 0 .1875.039.3496.1172.4863.0781.1368.1924.2618.3428.375.1504.1133.334.2237.5507.331.2168.1075.4678.2237.753.3487.293.1524.5693.3125.829.4805.2598.168.4884.3535.6856.5566.1973.2032.3535.4287.4688.6768.1152.248.1728.5303.1728.8467 0 .4258-.086.7851-.2578 1.0781-.1719.293-.4033.5312-.6943.7148-.291.1836-.626.3164-1.0049.3985-.379.082-.7793.123-1.2012.123-.1406 0-.3135-.0107-.5185-.0322a7.5618 7.5618 0 0 1-.63-.0938 5.7938 5.7938 0 0 1-.6093-.1494c-.1914-.0586-.3457-.125-.4629-.1992ZM33.9907 15.7812h-2.414V23H30.182v-7.2188H27.774v-1.1836h6.2168z",
  46,
  46
);

//compa
defineFigureByPath(
  NodeDesign.lessThanNode,
  "FM0 0h46v46H0z x" + "m19.0924 12.1223-14 8.3644 14 8.6356",
  46,
  46
);
defineFigureByPath(
  NodeDesign.lessThanOrEqualNode,
  "FM0 0h46v46H0z x" + "FM18.8128 12 5 17.9775l14 5.3558" + "FM5 23.6442 19 29",
  46,
  46
);
defineFigureByPath(
  NodeDesign.greaterThanNode,
  "FM0 0h46v46H0z" + "m5.0925 12.1223 14 8.3644-14 8.6356",
  46,
  46
);
defineFigureByPath(
  NodeDesign.greaterThanOrEqualNode,
  "FM0 0h46v46H0z " + "M5.1872 12 19 17.9775 5 23.3333M19 23.6442 5 29",
  46,
  46
);
defineFigureByPath(
  NodeDesign.differentNode,
  "FM0 0h46v46H0z x" + "m13 12-9 8.3838L13 29M18 12l9 8.3838L18 29",
  46,
  46
);
defineFigureByPath(
  NodeDesign.equalNode,
  "FM0 0h46v46H0z" + "M0 0h46v46H0zM4 13.5h19M4 23.5h19",
  46,
  46
);
//logic
defineFigureByPath(
  NodeDesign.andAryNode,
  "FM27,1 C32.5228475,1 37.5228475,3.23857625 41.1421356,6.85786438 C44.7614237,10.4771525 47,15.4771525 47,21 C47,26.5228475 44.7614237,31.5228475 41.1421356,35.1421356 C37.5228475,38.7614237 32.5228475,41 27,41 L27,41 L1,41 L1,1 Z",
  48,
  42
);
defineFigureByPath(
  NodeDesign.orAryNode,
  "FM1.85863663,1 L27,1 C32.5228475,1 37.5228475,3.23857625 41.1421356,6.85786438 C44.7614237,10.4771525 47,15.4771525 47,21 C47,26.5228475 44.7614237,31.5228475 41.1421356,35.1421356 C37.5228475,38.7614237 32.5228475,41 27,41 L27,41 L1.85978399,41 C6.09646507,34.3386456 8.2,27.6713675 8.2,21.006396 C8.2,14.3409291 6.09610864,7.66938394 1.85863663,1 L1.85863663,1 Z x",
  48,
  42
);
defineFigureByPath(
  NodeDesign.notAryNode,
  "FM1,1.63529402 L36.8085387,19.9653841 L1,38.3620004 L1,1.63529402 ZM38 20.5a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0z",
  48,
  40
);

defineFigureByPath(
  NodeDesign.xorAryNode,
  "FM1.85863663 1H27c5.5228475 0 10.5228475 2.23857625 14.1421356 5.85786438C44.7614237 10.4771525 47 15.4771525 47 21c0 5.5228475-2.2385763 10.5228475-5.8578644 14.1421356C37.5228475 38.7614237 32.5228475 41 27 41H1.85978399C6.09646507 34.3386456 8.2 27.6713675 8.2 21.006396 8.2 14.3409291 6.09610864 7.66938394 1.85863663 1Z x M9 41.0232558c4-6.6854197 6-13.3745387 6-20.0673569C15 14.2963384 13.0198272 7.63662015 9.05948165.97674419",
  48,
  42
);
//bitwise
defineFigureByPath(
  NodeDesign.landAryNode,
  "FM27,1 C32.5228475,1 37.5228475,3.23857625 41.1421356,6.85786438 C44.7614237,10.4771525 47,15.4771525 47,21 C47,26.5228475 44.7614237,31.5228475 41.1421356,35.1421356 C37.5228475,38.7614237 32.5228475,41 27,41 L27,41 L1,41 L1,1 ZM8 19.72c-.84 0-1.49.34-1.95 1.04-.44.66-.66 1.55-.66 2.67 0 1.12.22 2.01.66 2.67.46.69 1.11 1.04 1.95 1.04.83 0 1.48-.35 1.95-1.04.44-.66.66-1.55.66-2.67 0-1.12-.22-2.01-.66-2.67-.47-.7-1.12-1.04-1.95-1.04Zm0 .99c.56 0 .96.31 1.2.95.16.43.24 1.02.24 1.77 0 .74-.08 1.33-.24 1.77-.24.63-.64.95-1.2.95-.57 0-.97-.32-1.2-.95-.16-.44-.24-1.03-.24-1.77 0-.75.08-1.34.24-1.77.23-.64.63-.95 1.2-.95ZM13.32 19.86c-.24.25-.54.48-.9.7-.36.2-.7.34-1.02.42v1.16c.66-.19 1.2-.48 1.63-.87V27h1.17v-7.14h-.88Z",
  48,
  42
);
defineFigureByPath(
  NodeDesign.lorAryNode,
  "FM1.854 1h24.9238c5.5228 0 10.5228 2.2386 14.1421 5.8579 3.6193 3.6193 5.8579 8.6193 5.8579 14.1421 0 5.5228-2.2386 10.5228-5.8579 14.1421C37.3006 38.7614 32.3006 41 26.7778 41H1.855c4.2174-6.6613 6.3116-13.3286 6.3116-19.9936 0-6.6655-2.0945-13.337-6.3128-20.0064ZM17 19.72c-.84 0-1.49.35-1.95 1.06-.42.65-.63 1.53-.63 2.65 0 1.11.21 1.99.63 2.65.46.7 1.11 1.06 1.95 1.06.84 0 1.49-.36 1.95-1.06.42-.66.63-1.55.63-2.65 0-1.11-.21-1.99-.63-2.65-.46-.71-1.11-1.06-1.95-1.06Zm0 .92c.58 0 1 .32 1.24.97.17.44.26 1.05.26 1.82 0 .76-.09 1.37-.26 1.82-.24.64-.66.97-1.24.97-.59 0-1-.33-1.24-.97-.18-.45-.26-1.06-.26-1.82 0-.77.08-1.38.26-1.82.24-.65.65-.97 1.24-.97ZM22.32 19.86c-.24.26-.54.49-.9.71-.36.2-.69.34-1.01.42v1.08c.66-.19 1.21-.49 1.64-.9V27h1.09v-7.14h-.82Z",
  48,
  42
);

defineFigureByPath(
  NodeDesign.lnotAryNode,
  "Fm1 1.6353 35.8085 18.33L1 38.362V1.6353ZM38 20.5a4.5 4.5 0 1 0 9 0a4.5 4.5 0 1 0 -9 0zM10.92 16.72c-.84 0-1.49.35-1.95 1.06-.42.65-.63 1.53-.63 2.65 0 1.11.21 1.99.63 2.65.46.7 1.11 1.06 1.95 1.06.84 0 1.49-.36 1.95-1.06.42-.66.63-1.55.63-2.65 0-1.11-.21-1.99-.63-2.65-.46-.71-1.11-1.06-1.95-1.06Zm0 .92c.58 0 1 .32 1.24.97.17.44.26 1.05.26 1.82 0 .76-.09 1.37-.26 1.82-.24.64-.66.97-1.24.97-.59 0-1-.33-1.24-.97-.18-.45-.26-1.06-.26-1.82 0-.77.08-1.38.26-1.82.24-.65.65-.97 1.24-.97ZM16.24 16.86c-.24.26-.54.49-.9.71-.36.2-.69.34-1.01.42v1.08c.66-.19 1.21-.49 1.64-.9V24h1.09v-7.14h-.82Z",
  48,
  40
);

defineFigureByPath(
  NodeDesign.lxorAryNode,
  "FM1.85863663 1H27c5.5228475 0 10.5228475 2.23857625 14.1421356 5.85786438C44.7614237 10.4771525 47 15.4771525 47 21c0 5.5228475-2.2385763 10.5228475-5.8578644 14.1421356C37.5228475 38.7614237 32.5228475 41 27 41H1.85978399C6.09646507 34.3386456 8.2 27.6713675 8.2 21.006396 8.2 14.3409291 6.09610864 7.66938394 1.85863663 1Z x M9 41.0232558c4-6.6854197 6-13.3745387 6-20.0673569C15 14.2963384 13.0198272 7.63662015 9.05948165.97674419 M22.92 19.72c-.84 0-1.49.35-1.95 1.06-.42.65-.63 1.53-.63 2.65 0 1.11.21 1.99.63 2.65.46.7 1.11 1.06 1.95 1.06.84 0 1.49-.36 1.95-1.06.42-.66.63-1.55.63-2.65 0-1.11-.21-1.99-.63-2.65-.46-.71-1.11-1.06-1.95-1.06Zm0 .92c.58 0 1 .32 1.24.97.17.44.26 1.05.26 1.82 0 .76-.09 1.37-.26 1.82-.24.64-.66.97-1.24.97-.59 0-1-.33-1.24-.97-.18-.45-.26-1.06-.26-1.82 0-.77.08-1.38.26-1.82.24-.65.65-.97 1.24-.97ZM28.24 19.86c-.24.26-.54.49-.9.71-.36.2-.69.34-1.01.42v1.08c.66-.19 1.21-.49 1.64-.9V27h1.09v-7.14h-.82Z",
  48,
  42
);

defineFigureByPath(
  NodeDesign.leftShift,
  "FM0 0h46v46H0z x m25 12-11 8.3645L25 29M16 12 5 20.3645 16 29",
  46,
  46
);
defineFigureByPath(
  NodeDesign.rightShift,
  "FM0 0h46v46H0z x m5 12 11 8.3645L5 29 M14 12 25 20.3645 14 29",
  46,
  46
);

//time
defineFigureByPath(
  NodeDesign.initNode,
  "FM0 0h46v46H0zm16.456 12.3223 8.7273 7.8724-8.7273 8.1276M0 0h46v46H0zM4 20.5h20",
  46,
  46
);
defineFigureByPath(
  NodeDesign.previous + "Node",

  "FM0 0h46v46H0zM6.4258 18.9531V22H5.037v-8.4023H7.586c.9649 0 1.713.2246 2.2442.6738.5312.4492.7969 1.082.7969 1.8984s-.2774 1.4844-.832 2.004c-.5548.5195-1.3048.7792-2.25.7792H6.4257Zm0-4.207v3.0703h.9023c.5977 0 1.0528-.1387 1.3653-.416.3125-.2774.4687-.668.4687-1.1719 0-.9883-.5742-1.4824-1.7226-1.4824H6.4258ZM18.7163 22h-1.6289l-1.3418-2.25c-.1211-.207-.2393-.3838-.3545-.5303-.1152-.1465-.2324-.2666-.3516-.3603a1.1865 1.1865 0 0 0-.3896-.2051c-.1406-.043-.2988-.0645-.4746-.0645h-.5625V22H12.224v-8.4023h2.7656c.3946 0 .7579.0468 1.0899.1406.332.0937.621.2353.8672.4248.246.1894.4384.4258.5771.709.1387.2832.208.6142.208.9931 0 .297-.044.5694-.1318.8174-.0879.248-.2129.4688-.375.6621-.1621.1934-.3574.3584-.586.4951-.2285.1368-.4853.2422-.7705.3164v.0235c.1524.086.2852.1807.3985.2842.1133.1035.2207.21.3222.3193.1016.1094.2022.2334.3018.372.0996.1387.21.2999.331.4835L18.7164 22Zm-5.1035-7.2715v2.7305h1.1601c.2149 0 .4131-.0332.5948-.0996.1816-.0664.3388-.1621.4716-.2871.1329-.125.2364-.2774.3106-.457.0742-.1798.1113-.381.1113-.6036 0-.4023-.127-.7168-.3808-.9433-.254-.2266-.6192-.3399-1.0957-.3399h-1.172ZM24.585 22H19.868v-8.4023h4.5293v1.1836h-3.1347v2.3789h2.8886v1.1777h-2.8886v2.4844h3.3222z",
  46,
  46
);
defineFigureByPath(
  NodeDesign.followedBy,
  "FM0 0h46v46H0zM9.5723 14.7813H6.4316v2.5254h2.8946v1.1777H6.4316V22H5.0371v-8.4023h4.5352zM11.2397 22v-8.4023h2.666c.8126 0 1.4561.1777 1.9307.5332.4746.3554.712.8183.712 1.3886 0 .4766-.1348.8907-.4044 1.2422-.2695.3516-.6425.6016-1.1191.75v.0235c.5781.0664 1.04.2802 1.3857.6416.3457.3613.5186.831.5186 1.4091 0 .7188-.2832 1.3008-.8496 1.7461-.5664.4453-1.2813.668-2.1445.668h-2.6954Zm1.3887-7.2832v2.3906h.9024c.4843 0 .8642-.1142 1.1396-.3428.2754-.2285.413-.5517.413-.9697 0-.7187-.4804-1.0781-1.4413-1.0781h-1.0137Zm0 3.5098v2.6601h1.1895c.5195 0 .9209-.1201 1.204-.3603.2833-.2403.4249-.5713.4249-.9932 0-.871-.6035-1.3066-1.8106-1.3066h-1.0078ZM24.169 13.5977l-2.754 5.3496V22h-1.3945v-3.0234l-2.6836-5.379h1.5879l1.6523 3.6036c.0196.043.0782.205.1758.4863h.0176c.0352-.125.0996-.2871.1934-.4863l1.7285-3.6035h1.4765Z",
  46,
  46
);
defineFigureByPath(
  NodeDesign.times + "Node",
  "FM0 0h46v46H0z xM5.1356 34 h16.9812  L5.1356 17  h16.9812z ",
  46,
  46
);

defineFigureByPath(
  ShapeDesign.ITERATOR_BACKGROUND,
  "FM0 0 v100 h100 v-100 Z M5 -5  h100 v100 h-5 v-95 h-95 v-5Z",
  100,
  100
);
//higher order
go.Shape.defineFigureGenerator(ShapeDesign.ACTIVATE, (shape, w, h) => {
  return new go.Geometry();
});

go.Shape.defineFigureGenerator(ShapeDesign.RESTART, (shape, w, h) => {
  const curve = 0.05;
  return new go.Geometry();
});
defineFigureByPath("RESTART", "m14 5 5.98965226-6L26 5M20 0v10", 15, 15);
defineFigureByPath(
  NodeDesign.restartNode,
  "FM0 0h78v78H0z x m41 15 5.98965226-6L53 15M47 9v10",
  78,
  78
);
defineFigureByPath(
  "RdRectangle",
  "FM0 0h78v78H0z x m41 9 5.9897 6L53 9M47 15V5M40 18.5h14",
  78,
  78
);
defineFigureByPath("Rectangle", "FM0 0h78v78H0z", 78, 78);
defineFigureByPath(
  "Initial",
  "M1.5 7.5a2 2 0 1 0 4 0a2 2 0 1 0 -4 0z M9.5 7L11 4H8L9.5 7Z",
  11,
  11,
  true
);
defineFigureByPath(
  "Initial1",
  "M3.5 5.5V4C3.5 2.89543 4.39543 2 5.5 2H7.5C8.60457 2 9.5 2.89543 9.5 4",
  11,
  11,
  false
);
//choice
defineFigureByPath(
  NodeDesign.ifThenElse,
  "FM0 0h11v11H0z x fM38 11h11v11H38z x M1 24h9v9H1zM10 29l33-12",
  48,
  33
);
defineFigureByPath(
  NodeDesign.caseOp,
  "FM0 0h46v46H0zm41.3786.4721 3.8943 23.0033-3.8943 22.9967",
  46,
  46
);

// function defineFigureBySVG(name: string, svgStr: string) {
//   let viewBoxStr = new RegExp('viewBox="(.*?)"')
//     .exec(svgStr)[0]
//     .replace("viewBox=", "");
//   let svgPath = new RegExp('path d="(.*?)"')
//     .exec(svgStr)[0]
//     .replace("path d=", "");

//   let viewBoxList = viewBoxStr.split(" ");
//   // console.log(viewBoxList)
//   let svgWidth = parseFloat(viewBoxList[2]);
//   let svgHeight = parseFloat(viewBoxList[3]);

//   go.Shape.defineFigureGenerator(name, (shape, w, h) => {
//     var geometry = go.Geometry.parse(svgPath, true);
//     return geometry.scale(w / svgWidth, h / svgHeight);
//   });
//   go.Shape.defineFigureGenerator("u" + name, (shape, w, h) => {
//     let svgPath2 =
//       "FM 0 0" +
//       " h " +
//       svgWidth +
//       " v " +
//       svgHeight +
//       " h -" +
//       svgWidth +
//       " z" +
//       svgPath;
//     var geometry = go.Geometry.parse(svgPath2, false);
//     return geometry.scale(w / svgWidth, h / svgHeight);
//   });
// }
