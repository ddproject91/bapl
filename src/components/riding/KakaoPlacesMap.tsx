"use client";

import { useEffect, useRef, useState } from "react";
import type { Place } from "@/lib/types";

declare global {
  interface Window {
    kakao: any;
  }
}

function escapeHtml(s: string): string {
  return s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] ?? c,
  );
}

interface MarkerEntry {
  id: string;
  marker: any;
  position: any;
  info: any;
}

export function KakaoPlacesMap({
  places,
  selectedId,
}: {
  places: Place[];
  selectedId?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<MarkerEntry[]>([]);
  const openInfoRef = useRef<any>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const withCoords = places.filter(
    (p) =>
      typeof p.lat === "number" &&
      typeof p.lng === "number" &&
      !(p.lat === 0 && p.lng === 0),
  );

  // SDK 로드 (최초 1회)
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_KAKAO_MAP_KEY;
    if (!key) {
      setError("카카오맵 키가 설정되지 않았습니다.");
      return;
    }
    if (window.kakao?.maps) {
      setLoaded(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${key}&autoload=false`;
    script.async = true;
    script.onload = () => window.kakao.maps.load(() => setLoaded(true));
    script.onerror = () => setError("카카오맵을 불러오지 못했습니다.");
    document.head.appendChild(script);
  }, []);

  // 지도 생성 (SDK 로드 후 최초 1회)
  useEffect(() => {
    if (!loaded || !containerRef.current || mapRef.current) return;
    const kakao = window.kakao;
    mapRef.current = new kakao.maps.Map(containerRef.current, {
      center: new kakao.maps.LatLng(37.5665, 126.978),
      level: 8,
    });
  }, [loaded]);

  // 마커 갱신
  useEffect(() => {
    if (!loaded || !mapRef.current) return;
    const kakao = window.kakao;
    const map = mapRef.current;

    markersRef.current.forEach((m) => m.marker.setMap(null));
    markersRef.current = [];
    openInfoRef.current = null;

    if (withCoords.length === 0) return;

    const bounds = new kakao.maps.LatLngBounds();
    withCoords.forEach((p) => {
      const position = new kakao.maps.LatLng(p.lat, p.lng);
      const marker = new kakao.maps.Marker({ position, map });
      const info = new kakao.maps.InfoWindow({
        content: `<div style="padding:6px 10px;font-size:12px;white-space:nowrap;">${escapeHtml(p.name)}</div>`,
      });
      kakao.maps.event.addListener(marker, "mouseover", () => info.open(map, marker));
      kakao.maps.event.addListener(marker, "mouseout", () => {
        if (openInfoRef.current !== info) info.close();
      });
      if (p.linkUrl) {
        kakao.maps.event.addListener(marker, "click", () => {
          window.open(p.linkUrl, "_blank", "noopener,noreferrer");
        });
      }
      markersRef.current.push({ id: p.id, marker, position, info });
      bounds.extend(position);
    });
    map.setBounds(bounds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded, JSON.stringify(withCoords.map((p) => [p.id, p.lat, p.lng]))]);

  // 카드에서 "지도에서 보기"를 누르면 해당 위치로 이동+확대하고 말풍선을 띄운다.
  useEffect(() => {
    if (!loaded || !mapRef.current || !selectedId) return;
    const entry = markersRef.current.find((m) => m.id === selectedId);
    if (!entry) return;
    const map = mapRef.current;

    openInfoRef.current?.close();
    map.panTo(entry.position);
    map.setLevel(4);
    entry.info.open(map, entry.marker);
    openInfoRef.current = entry.info;
  }, [loaded, selectedId]);

  if (error) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border border-dashed border-border-strong bg-bg-elevated text-center text-sm text-fg-subtle">
        {error}
      </div>
    );
  }

  return (
    <div>
      <div
        ref={containerRef}
        className="h-64 w-full overflow-hidden rounded-2xl border border-border sm:h-80"
      />
      {loaded && withCoords.length === 0 && (
        <p className="mt-2 text-center text-xs text-fg-subtle">
          아직 좌표가 등록된 플레이스가 없습니다. 관리자에서 위도/경도를 입력해주세요.
        </p>
      )}
    </div>
  );
}
