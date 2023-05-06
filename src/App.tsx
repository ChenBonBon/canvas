import { useCallback, useEffect, useMemo, useState } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import Diagram from "./components/Diagram";
import { CompoundCommand } from "./components/Diagram/commands";
import { convertDiagram } from "./components/Diagram/convertDiagram";
import { commandsRequest } from "./components/Diagram/operation";
import { query } from "./request";
import MyWorker from "./worker.js?worker";

const worker = new MyWorker();

const connectionStatusMap = {
  [ReadyState.CONNECTING]: "Connecting",
  [ReadyState.OPEN]: "Open",
  [ReadyState.CLOSING]: "Closing",
  [ReadyState.CLOSED]: "Closed",
  [ReadyState.UNINSTANTIATED]: "Uninstantiated",
};

const isDiagramRefreshedEventPayload = (diagramEvent: any) =>
  diagramEvent.__typename === "DiagramRefreshedEventPayload";

function mockData() {
  worker.postMessage("start");
}

async function request(commands: any[]) {
  await commandsRequest(
    "82ad032e-2350-4bbb-bd8c-4c152a91e8f8",
    "aa2d5fb9-0215-498b-ae13-84347ac41ebf",
    new CompoundCommand(...commands)
  );
}

export default function App() {
  const [diagramData, setDiagramData] = useState<any>({});

  const { sendMessage, lastMessage, readyState } = useWebSocket(
    "ws://localhost:5173/api/smave/subscriptions",
    {
      protocols: "graphql-ws",
    }
  );

  const connect = useCallback(
    () => sendMessage(JSON.stringify({ type: "connection_init", payload: {} })),
    []
  );

  const fetchData = useCallback(
    () =>
      sendMessage(
        JSON.stringify({
          id: 1,
          payload: {
            variables: {
              input: {
                id: "914f6a64-b5f0-4479-8cef-088efd15d625",
                editingContextId: "82ad032e-2350-4bbb-bd8c-4c152a91e8f8",
                diagramId: "aa2d5fb9-0215-498b-ae13-84347ac41ebf",
              },
            },
            extensions: {},
            operationName: "diagramEvent",
            query,
          },
          type: "start",
        })
      ),
    []
  );

  const connectionStatus = useMemo(() => {
    return connectionStatusMap[readyState];
  }, [readyState]);

  useEffect(() => {
    worker.onmessage = (e) => {
      const { diagram } = e.data;

      if (diagramData) {
        const newDiagramData = convertDiagram(diagram[0], true);
        setDiagramData(newDiagramData);
      }
    };
  }, []);

  useEffect(() => {
    if (lastMessage?.data) {
      const { payload } = JSON.parse(lastMessage.data);
      if (payload) {
        const data = payload.data;
        const { diagramEvent } = data;
        if (isDiagramRefreshedEventPayload(diagramEvent)) {
          const diagram = diagramEvent.diagram;
          const newDiagramData = convertDiagram(diagram, true);
          setDiagramData(newDiagramData);
        }
      }
    }
  }, [lastMessage]);

  return (
    <div>
      <div>
        <button onClick={connect} disabled={readyState !== ReadyState.OPEN}>
          创建连接
        </button>
        <button onClick={fetchData}>获取数据</button>
        <button onClick={mockData}>修改第一节点位置</button>
      </div>
      <div>The WebSocket is currently {connectionStatus}</div>
      <Diagram diagramData={diagramData} />
    </div>
  );
}
