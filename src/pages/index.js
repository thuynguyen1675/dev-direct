import { useEffect, useState, useRef } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function App() {
  const { data, error } = useSWR("/api/staticdata", fetcher);
  console.log("data: ", data, error);
  const saveData = async () => {
    const response = await fetch("/api/storeJSONData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: "Lorenzo", email: "lo@lorenzozar.com" }),
    });
    const data = await response.json();
    console.log(data);
  };
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [listComponent, setListComponent] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [editText, setEditText] = useState("");
  const [dragging, setDragging] = useState("");
  const ref = useRef(null);
  const inputRef = useRef(null);
  // useEffect(() => {
  //   inputRef.current?.focus();
  // }, [isEdit]);
  const handleChangeContent = (e, id) => {
    e.preventDefault();
    setListComponent(
      listComponent.map((item) =>
        item.id !== id
          ? item
          : { ...item, props: { ...item.props, content: e.target.value } }
      )
    );
  };

  const handleDragEnd = (e) => {
    setListComponent([
      ...listComponent,
      {
        id: Date.now(),
        component: e.target.id,
        isEdit: false,
        props: {
          content: e.target.id,
        },
      },
    ]);
    setDragging("");
  };
  console.log(listComponent);

  const handleDragging = (event) => {
    setDragging(event.target.id);
    setCoords({
      x: event.pageX,
      y: event.pageY,
    });
  };

  useEffect(() => {
    const handleMouseMove = (event) => {
      setCoords({
        x: event.pageX,
        y: event.pageY,
      });
    };

    ref.current?.addEventListener("mousemove", handleMouseMove);
    return () => {
      ref.current?.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div style={{ display: "flex", padding: "20px", height: "95vh" }}>
      <div style={{ borderRight: "1px solid #000", paddingRight: "20px" }}>
        <img
          src="https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
          alt="btn"
          width={50}
          height={50}
          draggable
          onDrag={handleDragging}
          onDragEnd={handleDragEnd}
          id="button"
        />
        <img
          src="https://www.simplilearn.com/ice9/free_resources_article_thumb/what_is_image_Processing.jpg"
          alt="p"
          width={50}
          height={50}
          draggable
          onDrag={handleDragging}
          onDragEnd={handleDragEnd}
          id="p"
        />
      </div>
      <div style={{ width: "100%" }}>
        <div style={{ paddingLeft: "20px", display: "flex" }} ref={ref}>
          <div style={{ width: "20%" }}>
            <p>
              Mouse: ({coords.x}, {coords.y})
            </p>
            <p>Dragging: {dragging}</p>
            <p>Instances: {listComponent.length}</p>
            <p>Config:</p>
          </div>
          <div style={{ margin: "auto" }}>
            {listComponent.map((item) => {
              return item.component === "button" ? (
                <div style={{ margin: "10px 0" }}>
                  <input
                    key={item.id}
                    ref={inputRef}
                    type={isEdit ? "text" : "button"}
                    defaultValue={item.props.content}
                    onClick={() => setIsEdit(true)}
                    onChange={(e) => handleChangeContent(e, item.id)}
                  />
                </div>
              ) : (
                <div style={{ margin: "10px 0" }}>
                  <input
                    key={item.id}
                    ref={inputRef}
                    type="text"
                    readOnly
                    defaultValue={item.props.content}
                    onClick={() => setIsEdit(true)}
                    onChange={(e) => handleChangeContent(e, item.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
        <div
          style={{
            borderTop: "1px solid #000",
            height: "200px",
            position: "absolute",
            bottom: -65,
            width: "100%",
          }}
        >
          <form>
            <input type="text" />
            <button onClick={saveData}>btn</button>
          </form>
        </div>
      </div>
    </div>
  );
}
