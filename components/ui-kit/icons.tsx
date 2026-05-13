import {
  Banknote,
  ChartNoAxesCombined,
  Factory,
  Megaphone,
  Percent,
  ShieldCheck,
  Target,
  TrendingUp,
  Truck,
  UserMinus,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  revenue: Banknote,
  margin: Percent,
  ebitda: ChartNoAxesCombined,
  cash: Wallet,
  users: Users,
  pipeline: TrendingUp,
  truck: Truck,
  userMinus: UserMinus,
  wallet: Wallet,
  trending: TrendingUp,
  factory: Factory,
  megaphone: Megaphone,
  shield: ShieldCheck,
  target: Target,
};

export function DomainIcon({
  name,
  className,
  style,
}: {
  name: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const Icon = map[name] ?? ChartNoAxesCombined;
  return <Icon className={className} style={style} />;
}
