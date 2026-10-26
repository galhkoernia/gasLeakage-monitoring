import { useEffect, useRef } from "react";
import * as echarts from "echarts/core";
import { LineChart } from "echarts/charts";
import {
  GridComponent,
  LegendComponent,
  TooltipComponent,
} from "echarts/components";
import { CanvasRenderer } from "echarts/renderers";
import type { RangeKey, TelemetryPoint } from "../../types";
import { RANGE_KEYS } from "../../utils/constants";

echarts.use([
  LineChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  CanvasRenderer,
]);

const COLORS = {
  line: "#2563eb",
  warning: "#eab308",
  danger: "#dc2626",
  axis: "#64748b",
  grid: "#e2e8f0",
};

interface Props {
  points: TelemetryPoint[];
  warning: number;
  danger: number;
  height?: number;
}

export function TelemetryChart({
  points,
  warning,
  danger,
  height = 320,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const chart = useRef<echarts.ECharts | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const c = echarts.init(ref.current);
    chart.current = c;
    const ro = new ResizeObserver(() => c.resize());
    ro.observe(ref.current);
    return () => {
      ro.disconnect();
      c.dispose();
      chart.current = null;
    };
  }, []);

  useEffect(() => {
    if (!chart.current || !points.length) return;
    const first = points[0].t;
    const last = points[points.length - 1].t;
    const peak = Math.max(danger * 1.3, ...points.map((p) => p.value));
    const ref_ = (name: string, v: number, color: string) => ({
      name,
      type: "line" as const,
      data: [
        [first, v],
        [last, v],
      ],
      showSymbol: false,
      lineStyle: { color, type: "dashed" as const, width: 1.5 },
      itemStyle: { color },
      silent: true,
    });
    chart.current.setOption({
      animation: false,
      grid: { left: 56, right: 16, top: 40, bottom: 28 },
      legend: {
        top: 0,
        icon: "roundRect",
        itemWidth: 16,
        itemHeight: 2,
        textStyle: { color: COLORS.axis },
      },
      tooltip: { trigger: "axis", valueFormatter: (v: number) => `${v} ADC` },
      xAxis: {
        type: "time",
        axisLabel: { color: COLORS.axis, hideOverlap: true },
        axisLine: { lineStyle: { color: COLORS.grid } },
        splitLine: { show: false },
      },
      yAxis: {
        type: "value",
        min: 0,
        max: Math.ceil(peak / 200) * 200,
        name: "Gas Level (ADC)",
        nameLocation: "middle",
        nameGap: 44,
        nameTextStyle: { color: COLORS.axis },
        axisLabel: { color: COLORS.axis },
        splitLine: { lineStyle: { color: COLORS.grid } },
      },
      series: [
        {
          name: "Gas Level",
          type: "line",
          smooth: 0.2,
          showSymbol: false,
          data: points.map((p) => [p.t, p.value]),
          lineStyle: { color: COLORS.line, width: 2 },
          itemStyle: { color: COLORS.line },
          areaStyle: { color: COLORS.line, opacity: 0.07 },
        },
        ref_(`Warning (${warning})`, warning, COLORS.warning),
        ref_(`Danger (${danger})`, danger, COLORS.danger),
      ],
    });
  }, [points, warning, danger]);

  return (
    <div
      ref={ref}
      role="img"
      aria-label="Gas sensor telemetry time-series chart"
      style={{ height }}
      className="w-full"
    />
  );
}

export function RangeSelector({
  value,
  onChange,
}: {
  value: RangeKey;
  onChange: (r: RangeKey) => void;
}) {
  return (
    <div
      role="group"
      aria-label="Time range"
      className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-0.5"
    >
      {RANGE_KEYS.map((r) => (
        <button
          key={r}
          type="button"
          aria-pressed={value === r}
          onClick={() => onChange(r)}
          className={`rounded-md px-3 py-1 text-sm font-medium ${value === r ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-white"}`}
        >
          {r}
        </button>
      ))}
    </div>
  );
}
