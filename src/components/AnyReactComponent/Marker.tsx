interface MarkerProps {
  lat: number;
  lng: number;
  children: React.ReactNode;
}

const Marker: React.FC<MarkerProps> = ({ children }) => <>{children}</>;

export default Marker;
