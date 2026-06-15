import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';

type Tab = 'home' | 'pos' | 'products' | 'settings';

interface Product {
  id: number;
  name: string;
  price: number;
  emoji: string;
  category: string;
}

interface CartItem extends Product {
  qty: number;
}

const PRODUCTS: Product[] = [
  { id: 1, name: 'Капучино', price: 220, emoji: '☕', category: 'Напитки' },
  { id: 2, name: 'Латте', price: 250, emoji: '🥛', category: 'Напитки' },
  { id: 3, name: 'Эспрессо', price: 150, emoji: '⚡', category: 'Напитки' },
  { id: 4, name: 'Круассан', price: 180, emoji: '🥐', category: 'Выпечка' },
  { id: 5, name: 'Чизкейк', price: 320, emoji: '🍰', category: 'Десерты' },
  { id: 6, name: 'Маффин', price: 190, emoji: '🧁', category: 'Десерты' },
  { id: 7, name: 'Сэндвич', price: 290, emoji: '🥪', category: 'Еда' },
  { id: 8, name: 'Салат', price: 340, emoji: '🥗', category: 'Еда' },
  { id: 9, name: 'Смузи', price: 280, emoji: '🍓', category: 'Напитки' },
];

const PAYMENTS = [
  { id: 'card', name: 'Картой', icon: 'CreditCard', color: 'gradient-brand' },
  { id: 'sbp', name: 'СБП', icon: 'Smartphone', color: 'gradient-accent' },
  { id: 'cash', name: 'Наличные', icon: 'Banknote', color: 'gradient-brand' },
];

const NAV: { id: Tab; label: string; icon: string }[] = [
  { id: 'home', label: 'Главная', icon: 'LayoutGrid' },
  { id: 'pos', label: 'Касса', icon: 'ShoppingCart' },
  { id: 'products', label: 'Товары', icon: 'Package' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

const Index = () => {
  const [tab, setTab] = useState<Tab>('pos');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCat, setActiveCat] = useState('Все');
  const [paid, setPaid] = useState(false);

  const categories = ['Все', ...Array.from(new Set(PRODUCTS.map((p) => p.category)))];

  const filtered = useMemo(
    () => (activeCat === 'Все' ? PRODUCTS : PRODUCTS.filter((p) => p.category === activeCat)),
    [activeCat]
  );

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s, i) => s + i.qty, 0);

  const add = (p: Product) => {
    setPaid(false);
    setCart((c) => {
      const ex = c.find((i) => i.id === p.id);
      if (ex) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...p, qty: 1 }];
    });
  };

  const dec = (id: number) =>
    setCart((c) =>
      c.flatMap((i) => (i.id === id ? (i.qty > 1 ? [{ ...i, qty: i.qty - 1 }] : []) : [i]))
    );

  const pay = () => {
    if (!total) return;
    setPaid(true);
    setTimeout(() => {
      setCart([]);
      setPaid(false);
    }, 2200);
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-28 md:pb-0">
      {/* decorative blobs */}
      <div className="pointer-events-none fixed -top-32 -right-32 h-96 w-96 rounded-full bg-primary/20 blur-3xl" />
      <div className="pointer-events-none fixed -bottom-40 -left-32 h-96 w-96 rounded-full bg-accent/20 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-40 glass border-b border-border/60">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand shadow-soft">
              <Icon name="Zap" className="text-white" size={24} />
            </div>
            <div>
              <p className="font-display text-lg font-extrabold leading-none">POS Касса</p>
              <p className="text-xs text-muted-foreground">Кофейня «Орбита»</p>
            </div>
          </div>
          <nav className="hidden items-center gap-1 rounded-2xl bg-secondary/60 p-1 md:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                  tab === n.id
                    ? 'gradient-brand text-white shadow-soft'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Icon name={n.icon} size={18} />
                {n.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="container py-8">
        {tab === 'home' && <Home onOpenPos={() => setTab('pos')} />}

        {tab === 'pos' && (
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* Catalog */}
            <section>
              <div className="mb-5 flex flex-wrap gap-2">
                {categories.map((c) => (
                  <button
                    key={c}
                    onClick={() => setActiveCat(c)}
                    className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                      activeCat === c
                        ? 'bg-foreground text-background'
                        : 'bg-secondary/60 text-muted-foreground hover:bg-secondary'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {filtered.map((p, i) => (
                  <button
                    key={p.id}
                    onClick={() => add(p)}
                    style={{ animationDelay: `${i * 40}ms` }}
                    className="group animate-float-up rounded-3xl border border-border bg-card p-5 text-left transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-soft active:scale-95"
                  >
                    <div className="mb-3 text-4xl transition-transform group-hover:scale-110">
                      {p.emoji}
                    </div>
                    <p className="font-display font-bold leading-tight">{p.name}</p>
                    <p className="mt-1 text-lg font-extrabold text-gradient">{p.price} ₽</p>
                  </button>
                ))}
              </div>
            </section>

            {/* Cart */}
            <aside className="lg:sticky lg:top-24 lg:self-start">
              <div className="rounded-3xl border border-border bg-card p-6 shadow-soft">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-display text-xl font-extrabold">Чек</h2>
                  <span className="rounded-full bg-secondary px-3 py-1 text-xs font-bold text-secondary-foreground">
                    {count} поз.
                  </span>
                </div>

                {cart.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground">
                    <Icon name="ShoppingBag" className="mx-auto mb-3 opacity-40" size={40} />
                    <p className="text-sm">Добавьте товары из каталога</p>
                  </div>
                ) : (
                  <div className="mb-4 space-y-2">
                    {cart.map((i) => (
                      <div
                        key={i.id}
                        className="flex animate-pop items-center gap-3 rounded-2xl bg-secondary/50 p-2"
                      >
                        <span className="text-2xl">{i.emoji}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold leading-tight">{i.name}</p>
                          <p className="text-xs text-muted-foreground">{i.price} ₽</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => dec(i.id)}
                            className="grid h-7 w-7 place-items-center rounded-full bg-background text-foreground hover:bg-border"
                          >
                            <Icon name="Minus" size={14} />
                          </button>
                          <span className="w-5 text-center text-sm font-bold">{i.qty}</span>
                          <button
                            onClick={() => add(i)}
                            className="grid h-7 w-7 place-items-center rounded-full gradient-brand text-white"
                          >
                            <Icon name="Plus" size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="mb-4 flex items-end justify-between border-t border-dashed border-border pt-4">
                  <span className="text-sm text-muted-foreground">Итого</span>
                  <span className="font-display text-3xl font-black">{total} ₽</span>
                </div>

                <p className="mb-2 text-xs font-semibold text-muted-foreground">Способ оплаты</p>
                <div className="grid grid-cols-3 gap-2">
                  {PAYMENTS.map((pm) => (
                    <button
                      key={pm.id}
                      onClick={pay}
                      disabled={!total}
                      className={`flex flex-col items-center gap-1 rounded-2xl p-3 text-white transition-all disabled:opacity-40 ${pm.color} hover:opacity-90 active:scale-95`}
                    >
                      <Icon name={pm.icon} size={20} />
                      <span className="text-[11px] font-bold">{pm.name}</span>
                    </button>
                  ))}
                </div>

                {paid && (
                  <div className="mt-4 flex animate-pop items-center justify-center gap-2 rounded-2xl gradient-accent py-3 font-bold text-white">
                    <Icon name="CheckCircle2" size={20} />
                    Оплата прошла успешно!
                  </div>
                )}
              </div>
            </aside>
          </div>
        )}

        {tab === 'products' && <Products />}
        {tab === 'settings' && <Settings />}
      </main>

      {/* Mobile nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 grid grid-cols-4 gap-1 border-t border-border glass p-2 md:hidden">
        {NAV.map((n) => (
          <button
            key={n.id}
            onClick={() => setTab(n.id)}
            className={`flex flex-col items-center gap-1 rounded-xl py-2 text-xs font-semibold transition-colors ${
              tab === n.id ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            <Icon name={n.icon} size={20} />
            {n.label}
          </button>
        ))}
      </nav>
    </div>
  );
};

const Home = ({ onOpenPos }: { onOpenPos: () => void }) => {
  const stats = [
    { label: 'Выручка сегодня', value: '34 280 ₽', icon: 'TrendingUp', grad: 'gradient-brand' },
    { label: 'Чеков', value: '142', icon: 'Receipt', grad: 'gradient-accent' },
    { label: 'Средний чек', value: '241 ₽', icon: 'Wallet', grad: 'gradient-brand' },
    { label: 'Возвраты', value: '2', icon: 'RotateCcw', grad: 'gradient-accent' },
  ];
  return (
    <div>
      <div className="mb-8 overflow-hidden rounded-3xl gradient-brand p-8 text-white shadow-soft animate-float-up">
        <p className="text-sm font-semibold opacity-80">Добро пожаловать 👋</p>
        <h1 className="font-display mt-1 text-3xl font-black md:text-4xl">
          Продавайте быстрее с POS Касса
        </h1>
        <p className="mt-2 max-w-md opacity-90">
          Приём оплат картой, СБП и наличными в пару касаний.
        </p>
        <Button
          onClick={onOpenPos}
          className="mt-5 rounded-2xl bg-white px-6 font-bold text-primary hover:bg-white/90"
        >
          Открыть кассу
          <Icon name="ArrowRight" size={18} />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            style={{ animationDelay: `${i * 60}ms` }}
            className="animate-float-up rounded-3xl border border-border bg-card p-5 shadow-soft"
          >
            <div className={`mb-3 grid h-11 w-11 place-items-center rounded-2xl ${s.grad}`}>
              <Icon name={s.icon} className="text-white" size={20} />
            </div>
            <p className="font-display text-2xl font-black">{s.value}</p>
            <p className="text-sm text-muted-foreground">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const Products = () => (
  <div>
    <h1 className="font-display mb-6 text-3xl font-black">Товары</h1>
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {PRODUCTS.map((p, i) => (
        <div
          key={p.id}
          style={{ animationDelay: `${i * 40}ms` }}
          className="flex animate-float-up items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft"
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-3xl">
            {p.emoji}
          </span>
          <div className="flex-1">
            <p className="font-display font-bold">{p.name}</p>
            <p className="text-sm text-muted-foreground">{p.category}</p>
          </div>
          <span className="font-display text-lg font-black text-gradient">{p.price} ₽</span>
        </div>
      ))}
    </div>
  </div>
);

const Settings = () => {
  const rows = [
    { icon: 'CreditCard', name: 'Эквайринг (карты)', desc: 'Приём оплаты картой', on: true },
    { icon: 'Smartphone', name: 'СБП', desc: 'Система быстрых платежей', on: true },
    { icon: 'Banknote', name: 'Наличные', desc: 'Расчёт наличными', on: true },
    { icon: 'Printer', name: 'Печать чеков', desc: 'Фискальный регистратор', on: false },
  ];
  return (
    <div className="max-w-2xl">
      <h1 className="font-display mb-6 text-3xl font-black">Настройки</h1>
      <p className="mb-3 text-sm font-semibold text-muted-foreground">Платёжные системы</p>
      <div className="space-y-3">
        {rows.map((r, i) => (
          <div
            key={r.name}
            style={{ animationDelay: `${i * 50}ms` }}
            className="flex animate-float-up items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-soft"
          >
            <span className="grid h-11 w-11 place-items-center rounded-2xl gradient-brand text-white">
              <Icon name={r.icon} size={20} />
            </span>
            <div className="flex-1">
              <p className="font-display font-bold">{r.name}</p>
              <p className="text-sm text-muted-foreground">{r.desc}</p>
            </div>
            <div
              className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${
                r.on ? 'gradient-accent justify-end' : 'bg-border justify-start'
              }`}
            >
              <span className="h-5 w-5 rounded-full bg-white shadow" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
