import * as React from 'react';
import { useEffect, useRef, useState } from 'react';
import './style.css';
import { outlineStroke } from 'outline-stroke';
import { useForm } from 'react-hook-form';

interface Point {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  b1: number;
  b2: number;
  gradientOpacity: number;
}

const initialPoints: Point[] = [];

// Boxgrösse definieren
const boundingBoxWidth = 720;
const boundingBoxHeight = 320;
const innerboundingBoxWidth = 540;
const innerboundingBoxHeight = 240;

// Build Viewbox based on image size
const viewBox = `${Math.floor(boundingBoxWidth - innerboundingBoxWidth) / 2} ${
  Math.floor(boundingBoxHeight - innerboundingBoxHeight) / 2
} ${innerboundingBoxWidth} ${innerboundingBoxHeight}`;

// Wie viele Kurven generiert werden sollen
const pointCount = 3;

// Farbe der Bezier Kurve definieren
const colorgradient = 'rgb(87,104,171)';

// Punkte generieren
export default function App() {
  const [points, setPoints] = useState<Point[]>(initialPoints);

  useEffect(() => {
    // Reset the value of the textarea with the newly generated points
    setValue('textarea', JSON.stringify(points, null, 2));
  }, [points]);

  const exportPoints = () => {
    // Macht aus den element einen String
    const pointString = JSON.stringify(points, null, 2);
    // Erstellt ein Blob objekt welches den points string enthält, der zweite teil definiert MIME typ der Daten, in diesem Fall "application/json"
    const blob = new Blob([pointString], { type: 'application/json' });
    // Dieser code erstellt eine URL für das Blob objekt der zum herunterladen der Svg Datei dient
    const url = URL.createObjectURL(blob);
    // Erstellt ein a element im DOM schnittstelle HTML- und XML-Dokumente.
    const link = document.createElement('a');
    // Stellt download attribute von a element zum gewünschten filename
    link.download = 'points.json';
    // Stellt "href" attribut von a element zu der URL von "Blob" objekt
    link.href = url;
    // Fügt ein "a" zum body hinzu
    document.body.appendChild(link);
    // Triggert beim klicken das a element welches den download auslöst
    link.click();
    // enfernt das a element vom body
    document.body.removeChild(link);
    // Gibt den erstellten URL frei und setzt damit Speicherressourcen frei
    URL.revokeObjectURL(url);
  };

  const exportFile = () => {
    // Svg Element dur Id im dokument ansprechen
    const svgElement = document.getElementById('svg');
    // View box definieren
    svgElement.setAttribute('viewBox', viewBox);
    // Svg Element zu einem String
    const svgString = new XMLSerializer().serializeToString(svgElement);
    // Erstellt ein Blob objekt welches den Svg string enthält, der zweite teil definiert MIME typ der Daten, in diesem Fall "image/svg+xml"
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    // Dieser code erstellt eine URL für das Blob objekt der zum herunterladen der Svg Datei dient
    const url = URL.createObjectURL(blob);
    // Erstellt ein a element im DOM schnittstelle HTML- und XML-Dokumente.
    const link = document.createElement('a');
    // Stellt download attribute von a element zum gewünschten filename
    link.download = 'random.svg';
    // Stellt "href" attribut von a element zu der URL von "Blob" objekt
    link.href = url;
    // Fügt ein "a" zum body hinzu
    document.body.appendChild(link);
    // Triggert beim klicken das a element welches den download auslöst
    link.click();
    // enfernt das a element vom body
    document.body.removeChild(link);
    // Gibt den erstellten URL frei und setzt damit Speicherressourcen frei
    URL.revokeObjectURL(url);
  };

  let richtungx1 = 0.5;
  let richtungy1 = 0.2;

  let richtungx2 = 0.5;
  let richtungy2 = 0.2;

  let richtungx3 = 0.5;
  let richtungy3 = 0.2;

  const animiere = () => {
    let pointx = points[0].x1;
    pointx += richtungx1;
    if (pointx >= boundingBoxHeight || pointx <= 0) {
      richtungx1 = -richtungx1;
    }

    points[0].x1 = Number(pointx.toFixed(2)); //  Dezimalstellen auf 2 begrenzt

    let pointy = points[0].y1;
    pointy += richtungy1;
    if (pointy >= boundingBoxHeight || pointy <= 0) {
      richtungy1 = -richtungy1;
    }

    points[0].y1 = Number(pointy.toFixed(2));
    setPoints([...points]);

    let pointx2 = points[1].x1;
    pointx2 += richtungx2;
    if (pointx2 >= boundingBoxHeight || pointx2 <= 0) {
      richtungx2 = -richtungx2;
    }

    points[1].x1 = Number(pointx2.toFixed(2));

    let pointy2 = points[1].y1;
    pointy2 += richtungy2;
    if (pointy2 >= boundingBoxHeight || pointy2 <= 0) {
      richtungy2 = -richtungy2;
    }

    points[1].y1 = Number(pointy2.toFixed(2));
    setPoints([...points]);

    let pointx3 = points[2].x1;
    pointx3 += richtungx3;
    if (pointx3 >= boundingBoxHeight || pointx3 <= 0) {
      richtungx3 = -richtungx3;
    }

    points[2].x1 = Number(pointx3.toFixed(2));

    let pointy3 = points[2].y1;
    pointy3 += richtungy3;
    if (pointy2 >= boundingBoxHeight || pointy3 <= 0) {
      richtungy3 = -richtungy3;
    }

    points[2].y1 = Number(pointy3.toFixed(2));
    setPoints([...points]);

    requestAnimationFrame(animiere);
  };

  // Create a form to store the textarea value and handle load events
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const onLoad = (data) => {
    try {
      console.log('DATA', data);
      const jsonData = JSON.parse(data.textarea);
      console.log('JSON', jsonData);

      setPoints(jsonData);
    } catch (err) {
      console.error('Error while loading data', err);
      alert('The provided input data is not in a correct format.');
    }
  };

  // Point Values
  const nullvalue = 0;
  const valueA = boundingBoxWidth;
  const valueB = boundingBoxHeight;

  const randomizePoints = () => {
    console.log('--- Generating new points ---');
    const newPoints: Point[] = [];

    for (let i = 0; i < pointCount; i++) {
      // Generate X and Y coordinates
      const x1 = Math.round(Math.random() * boundingBoxWidth);
      const y1 = Math.round(Math.random() * boundingBoxHeight);
      const x2 = Math.random() < 0.5 ? nullvalue : valueA;
      const y2 = Math.random() < 0.5 ? nullvalue : valueB;
      const b1 = Math.floor(
        Math.random() * (valueA - nullvalue + 1) + nullvalue
      );
      const b2 = Math.floor(
        Math.random() * (valueB - nullvalue + 1) + nullvalue
      );

      const gradientOpacity = Math.random() * (0.85 - 0.35 + 1) + 0.35;

      const p = { x1, y1, x2, y2, b1, b2, gradientOpacity };
      console.log('New point at', p);
      newPoints.push(p);
    }
    setPoints(newPoints);
  };

  return (
    <div>
      <h1>deliver.media random SVG</h1>
      <div className="main-box">
        <svg
          id="svg"
          width={boundingBoxWidth}
          height={boundingBoxHeight}
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          xmlnsXlink="http://www.w3.org/1999/xlink"
          viewBox={viewBox}
        >
          {/* Pfad auf das kleine Viereck zuschneiden */}
          <defs>
            <clipPath id="cut-off">
              <rect
                x="100"
                y="50"
                width={innerboundingBoxWidth}
                height={innerboundingBoxHeight}
              />
            </clipPath>
          </defs>
          {points.map((p, i) => {
            return (
              <g key={`gradient-${i}`}>
                <radialGradient
                  id={`grad-${i}`}
                  cx="50%"
                  cy="50%"
                  r="50%"
                  fx="50%"
                  fy="50%"
                >
                  {/* Color stops definieren */}
                  <stop
                    offset="0%"
                    style={{
                      stopColor: colorgradient,
                      stopOpacity: p.gradientOpacity,
                    }}
                  />

                  <stop
                    offset="100%"
                    style={{
                      stopColor: colorgradient,
                      stopOpacity: 1,
                    }}
                  />
                </radialGradient>
              </g>
            );
          })}

          {/* Äussere Box anzeigen */}
          <rect
            y="0"
            width={boundingBoxWidth}
            height={boundingBoxHeight}
            style={{
              fill: 'transparent',
              stroke: 'black',
              strokeWidth: 1,
            }}
          />

          {/* Random generierte Werte */}
          <g>
            {points.map((p, i) => {
              // Bezier Kurve mit random generierten Werte kombinieren
              const path = `M ${p.x1} ${p.y2} Q ${p.b1} ${p.b2} ${p.x2} ${p.y1}`;
              const area = outlineStroke(path, {
                linecap: 'round',
                linejoin: 'round',
                width: 140,
              });

              // Wählt einer der beiden Gradients aus
              const grad = `url(#grad-${i})`;
              return <path d={area} fill={grad} clipPath="url(#cut-off)" />;
            })}
          </g>
        </svg>
      </div>
      {/* Randomize Button ausgeben */}
      <button onClick={randomizePoints}>Randomize</button>
      {/* SVG export Button */}
      <button onClick={exportFile}>SVG</button>
      {/* Export Points Button */}
      <button onClick={exportPoints}>Points</button>
      {/* Animate Points Button */}
      <button onClick={animiere}>Animate</button>

      {/* Textarea mit Punkten ausgeben */}
      <hr />
      <form onSubmit={handleSubmit(onLoad)}>
        <textarea
          style={{ width: '100%', height: '300px' }}
          {...register('textarea')}
        ></textarea>
        <input type="submit" value="Load" />
      </form>
    </div>
  );
}
