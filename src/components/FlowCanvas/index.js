import React, { useState, useEffect } from 'react';
import { Flow } from 'gg-editor';
import './style.css';
import { dataMapToData } from '../../utils/dataMapToData';

const initData = JSON.parse(localStorage.getItem('data') || '{}');

const FlowCanvas = () => {
  const [edge, setEdge] = useState({});
  const [oncanvas, setOnCanvas] = useState(false);

  const mouseEvent = async (e) => {
    const event = await e;
    const EVENT_TYPE = e._type;

    if (!event?.item) {
      switch (EVENT_TYPE) {
        case 'mouseleave':
          setOnCanvas(true);
          break;
        case 'mouseenter':
          setOnCanvas(false);
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    if (edge.type === 'edge') {
      oncanvas ? (edge.isSelected = false) : (edge.isSelected = true);
    }
  }, [oncanvas, edge]);

  const [data, setData] = useState(initData);

  return (
    <Flow
      onAfterItemSelected={async (e) => {
        const item = await e.item;

        setEdge(item);
      }}
      onAfterChange={(e) => {
        // `changeData` is caused by setData and allowing `group` causes some error
        if (
          e.action === 'changeData' ||
          (e.item.type === 'group' && e.action !== 'remove')
        ) {
          return;
        }

        const data = dataMapToData(e.item && e.item.dataMap, e.item.itemMap);

        setData(data);
        localStorage.setItem('data', JSON.stringify(data));
      }}
      data={data}
      onBeforeItemUnselected={() => setEdge({})}
      onMouseEnter={mouseEvent}
      onMouseLeave={mouseEvent}
      className='flow'
    />
  );
};

export default FlowCanvas;
