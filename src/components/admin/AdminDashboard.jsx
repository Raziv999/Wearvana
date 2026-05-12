'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Package, Clock, CheckCircle, DollarSign, Plus, RefreshCw, LogOut, ShoppingBag, Tag, Wifi, WifiOff } from 'lucide-react'
import OrderTable from './OrderTable'
import NewOrderForm from './NewOrderForm'
import ProductTable from './ProductTable'
import ProductFormModal from './ProductFormModal'
import ProductDetailPanel from './ProductDetailPanel'

const API = process.env.NEXT_PUBLIC_API_URL

const STATUS_FILTERS = [
  { label: 'All',       value: '' },
  { label: 'Pending',   value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Sourcing',  value: 'sourcing' },
  { label: 'Arrived',   value: 'arrived' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
]

export default function AdminDashboard() {
  const router = useRouter()

  // Tab: 'orders' | 'products'
  const [tab, setTab] = useState('orders')

  // --- Orders state ---
  const [orders, setOrders]             = useState([])
  const [stats, setStats]               = useState(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [showNewOrder, setShowNewOrder] = useState(false)
  const [ordersLoading, setOrdersLoading] = useState(false)

  // --- Products state ---
  const [products, setProducts]               = useState([])
  const [productsLoading, setProductsLoading] = useState(false)
  const [editingProduct, setEditingProduct]   = useState(null)  // null = closed, {} = new, product = edit
  const [showProductForm, setShowProductForm] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)  // detail panel

  // --- Server status ---
  const [serverStatus, setServerStatus] = useState('checking') // 'checking' | 'online' | 'offline'
  const [waking, setWaking]             = useState(false)

  // ── Server wake-up ────────────────────────────────────────────
  const wakeServer = useCallback(async () => {
    setWaking(true)
    setServerStatus('checking')
    // Open the API in a new tab so the browser wakes Render regardless of CORS/timeout
    window.open(`${API}/api/products`, '_blank', 'noopener')
    // Poll every 5s for up to 75s until the server responds
    let attempts = 0
    const maxAttempts = 15
    const poll = async () => {
      attempts++
      try {
        const res = await fetch(`${API}/api/products`, { cache: 'no-store' })
        if (res.ok) {
          setServerStatus('online')
          const data = await res.json()
          setProducts(data)
          setWaking(false)
          return
        }
      } catch { /* still waking */ }
      if (attempts < maxAttempts) {
        setTimeout(poll, 5000)
      } else {
        setServerStatus('offline')
        setWaking(false)
      }
    }
    setTimeout(poll, 5000)
  }, [])

  useEffect(() => { wakeServer() }, [wakeServer])

  // ── Fetch orders ──────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true)
    try {
      const url = statusFilter
        ? `${API}/api/orders?status=${statusFilter}`
        : `${API}/api/orders`
      const [ordersRes, statsRes] = await Promise.all([
        fetch(url, { cache: 'no-store' }),
        fetch(`${API}/api/orders/stats`, { cache: 'no-store' }),
      ])
      setOrders(await ordersRes.json())
      setStats(await statsRes.json())
    } catch { /* API unreachable */ }
    setOrdersLoading(false)
  }, [statusFilter])

  // ── Fetch products ────────────────────────────────────────────
  const fetchProducts = useCallback(async () => {
    setProductsLoading(true)
    try {
      const res = await fetch(`${API}/api/products`, { cache: 'no-store' })
      setProducts(await res.json())
    } catch { /* API unreachable */ }
    setProductsLoading(false)
  }, [])

  useEffect(() => { fetchOrders()  }, [fetchOrders])
  useEffect(() => { fetchProducts() }, [fetchProducts])

  // ── Order handlers ────────────────────────────────────────────
  const handleStatusChange = async (orderId, newStatus) => {
    await fetch(`${API}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    fetchOrders()
  }

  const handlePaymentToggle = async (orderId, currentValue) => {
    await fetch(`${API}/api/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ advancePaid: !currentValue }),
    })
    fetchOrders()
  }

  // ── Auth ──────────────────────────────────────────────────────
  const handleLogout = async () => {
    await fetch('/api/admin/login', { method: 'DELETE' })
    router.replace('/admin/login')
  }

  const isLoading = tab === 'orders' ? ordersLoading : productsLoading

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F4F4F4]">

      {/* ── Top bar ── */}
      <div className="border-b border-[#242424] px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="font-heading font-black text-[#C0231E] text-2xl uppercase">Wearvana</span>
            <span className="font-body text-[#525252] text-xs tracking-widest uppercase ml-3">Admin</span>
          </div>

          {/* Tab switcher */}
          <div className="hidden sm:flex items-center gap-1 border border-[#242424] p-1">
            <button
              onClick={() => setTab('orders')}
              className={`flex items-center gap-1.5 font-body font-bold text-[10px] tracking-[0.15em] uppercase px-4 py-1.5 transition-all ${
                tab === 'orders'
                  ? 'bg-[#C0231E] text-white'
                  : 'text-[#525252] hover:text-[#F4F4F4]'
              }`}
            >
              <ShoppingBag size={11} />
              Orders
              {stats?.pending > 0 && (
                <span className={`text-[9px] px-1.5 py-0.5 rounded-full ${tab === 'orders' ? 'bg-white/20' : 'bg-[#C0231E]/20 text-[#C0231E]'}`}>
                  {stats.pending}
                </span>
              )}
            </button>
            <button
              onClick={() => setTab('products')}
              className={`flex items-center gap-1.5 font-body font-bold text-[10px] tracking-[0.15em] uppercase px-4 py-1.5 transition-all ${
                tab === 'products'
                  ? 'bg-[#C0231E] text-white'
                  : 'text-[#525252] hover:text-[#F4F4F4]'
              }`}
            >
              <Tag size={11} />
              Products
              <span className={`text-[9px] px-1.5 py-0.5 ${tab === 'products' ? 'bg-white/20' : 'bg-[#242424] text-[#525252]'}`}>
                {products.length}
              </span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={tab === 'orders' ? fetchOrders : fetchProducts}
            className="text-[#525252] hover:text-[#F4F4F4] transition-colors"
            title="Refresh"
          >
            <RefreshCw size={16} className={isLoading ? 'animate-spin' : ''} />
          </button>

          {tab === 'orders' ? (
            <button
              onClick={() => setShowNewOrder(true)}
              className="flex items-center gap-2 bg-[#C0231E] hover:bg-[#D4251F] text-white font-body font-bold text-[10px] tracking-widest uppercase px-4 py-2 transition-colors"
            >
              <Plus size={13} />
              New Order
            </button>
          ) : (
            <button
              onClick={() => { setEditingProduct(null); setShowProductForm(true) }}
              className="flex items-center gap-2 bg-[#C0231E] hover:bg-[#D4251F] text-white font-body font-bold text-[10px] tracking-widest uppercase px-4 py-2 transition-colors"
            >
              <Plus size={13} />
              Add Product
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[#525252] hover:text-[#C0231E] font-body text-[10px] tracking-widest uppercase transition-colors"
          >
            <LogOut size={14} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* ── Server status banner ── */}
      {serverStatus !== 'online' && (
        <div className={`px-4 sm:px-8 py-2 flex items-center gap-3 text-xs font-body ${
          serverStatus === 'checking' ? 'bg-[#1C1C1C] text-[#909090]' : 'bg-[#C0231E]/10 border-b border-[#C0231E]/20 text-[#C0231E]'
        }`}>
          {serverStatus === 'checking' ? (
            <>
              <RefreshCw size={12} className="animate-spin shrink-0" />
              Connecting to server…
            </>
          ) : (
            <>
              <WifiOff size={12} className="shrink-0" />
              {waking
                ? 'Opening server in new tab — wait ~30s then come back here…'
                : 'Server is asleep. Click Wake Server, wait for the new tab to load JSON, then come back.'}
              <button
                onClick={wakeServer}
                disabled={waking}
                className="ml-auto flex items-center gap-1.5 border border-[#C0231E]/40 hover:border-[#C0231E] px-3 py-1 transition-colors disabled:opacity-50"
              >
                <Wifi size={11} />
                {waking ? 'Waking… checking every 5s' : 'Wake Server'}
              </button>
            </>
          )}
        </div>
      )}

      {/* ── Mobile tab bar ── */}
      <div className="sm:hidden flex border-b border-[#242424]">
        {[
          { key: 'orders',   label: 'Orders',   icon: ShoppingBag },
          { key: 'products', label: 'Products', icon: Tag },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 flex items-center justify-center gap-2 py-3 font-body font-bold text-[10px] tracking-[0.15em] uppercase border-b-2 transition-all ${
              tab === key
                ? 'border-[#C0231E] text-[#F4F4F4]'
                : 'border-transparent text-[#525252]'
            }`}
          >
            <Icon size={12} />
            {label}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8">

        {/* ══ ORDERS TAB ══════════════════════════════════════════ */}
        {tab === 'orders' && (
          <>
            {/* Stats cards */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                  { label: 'Total Orders',      value: stats.total,             icon: Package,      color: '#F4F4F4' },
                  { label: 'Pending',           value: stats.pending,           icon: Clock,        color: '#FBBF24' },
                  { label: 'In Progress',       value: stats.confirmed + stats.sourcing + stats.arrived, icon: CheckCircle, color: '#34D399' },
                  { label: 'Advance Collected', value: `NPR ${stats.advanceCollected.toLocaleString()}`, icon: DollarSign,  color: '#C0231E' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-[#111111] border border-[#242424] p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-body text-[#525252] text-[9px] tracking-widest uppercase">{stat.label}</p>
                      <stat.icon size={14} style={{ color: stat.color }} />
                    </div>
                    <p className="font-product font-bold text-2xl" style={{ color: stat.color }}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* Status filter tabs */}
            <div className="flex flex-wrap gap-2 mb-6">
              {STATUS_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`font-body text-[10px] font-semibold tracking-[0.15em] uppercase px-4 py-2 border transition-all duration-200 ${
                    statusFilter === f.value
                      ? 'bg-[#C0231E] border-[#C0231E] text-white'
                      : 'bg-transparent border-[#242424] text-[#525252] hover:border-[#C0231E]/50 hover:text-[#F4F4F4]'
                  }`}
                >
                  {f.label}
                  {f.value && stats?.[f.value] > 0 && (
                    <span className="ml-1.5 opacity-70">({stats[f.value]})</span>
                  )}
                </button>
              ))}
            </div>

            <OrderTable
              orders={orders}
              loading={ordersLoading}
              onStatusChange={handleStatusChange}
              onPaymentToggle={handlePaymentToggle}
            />
          </>
        )}

        {/* ══ PRODUCTS TAB ════════════════════════════════════════ */}
        {tab === 'products' && (
          <>
            {/* Product stats strip */}
            <div className="flex flex-wrap gap-3 mb-6">
              {[
                { label: 'Total',     value: products.length,                                          color: '#F4F4F4' },
                { label: 'Live',      value: products.filter(p => p.available).length,                color: '#34D399' },
                { label: 'Sold Out',  value: products.filter(p => !p.available).length,               color: '#525252' },
                { label: 'Limited',   value: products.filter(p => p.limited).length,                  color: '#C0231E' },
                { label: 'Sneakers',  value: products.filter(p => p.category === 'sneakers').length,  color: '#909090' },
                { label: 'Running',   value: products.filter(p => p.category === 'running').length,   color: '#909090' },
                { label: 'Caps',      value: products.filter(p => p.category === 'caps').length,      color: '#909090' },
              ].map(stat => (
                <div key={stat.label} className="bg-[#111111] border border-[#242424] px-4 py-3 text-center min-w-[72px]">
                  <p className="font-product font-bold text-xl" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="font-body text-[#525252] text-[9px] tracking-widest uppercase mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Split layout: grid + detail panel */}
            <div className="flex gap-6 items-start">

              {/* Product grid — shrinks when panel is open */}
              <div className="flex-1 min-w-0">
                <ProductTable
                  products={products}
                  loading={productsLoading}
                  selectedId={selectedProduct?._id}
                  onSelect={(p) => setSelectedProduct(prev => prev?._id === p._id ? null : p)}
                  onEdit={(product) => { setEditingProduct(product); setShowProductForm(true) }}
                  onRefresh={fetchProducts}
                />
              </div>

              {/* Detail panel — full-screen on mobile, sticky sidebar on desktop */}
              {selectedProduct && (
                <>
                  {/* Mobile: full-screen overlay */}
                  <div className="lg:hidden fixed inset-0 z-40 flex flex-col bg-[#0A0A0A]">
                    <div className="flex-1 overflow-y-auto">
                      <ProductDetailPanel
                        key={selectedProduct._id}
                        product={products.find(p => p._id === selectedProduct._id) ?? selectedProduct}
                        onEdit={() => { setEditingProduct(selectedProduct); setShowProductForm(true) }}
                        onClose={() => setSelectedProduct(null)}
                        onRefresh={fetchProducts}
                        onDelete={async () => {
                          if (!confirm(`Delete "${selectedProduct.name}"?`)) return
                          try {
                            const res = await fetch(`${API}/api/products/${selectedProduct._id}`, { method: 'DELETE' })
                            if (!res.ok) throw new Error('Failed')
                            setSelectedProduct(null)
                            fetchProducts()
                          } catch {
                            alert('Delete failed — backend may be waking up, try again in 30 seconds.')
                          }
                        }}
                      />
                    </div>
                  </div>

                  {/* Desktop: sticky side panel */}
                  <div className="hidden lg:block w-80 xl:w-96 shrink-0 sticky top-6 max-h-[calc(100vh-8rem)] overflow-hidden">
                    <ProductDetailPanel
                      key={selectedProduct._id + '-desk'}
                      product={products.find(p => p._id === selectedProduct._id) ?? selectedProduct}
                      onEdit={() => { setEditingProduct(selectedProduct); setShowProductForm(true) }}
                      onClose={() => setSelectedProduct(null)}
                      onRefresh={fetchProducts}
                      onDelete={async () => {
                        if (!confirm(`Delete "${selectedProduct.name}"?`)) return
                        await fetch(`${API}/api/products/${selectedProduct._id}`, { method: 'DELETE' })
                        setSelectedProduct(null)
                        fetchProducts()
                      }}
                    />
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>

      {/* ── Modals ── */}
      {showNewOrder && (
        <NewOrderForm
          onClose={() => setShowNewOrder(false)}
          onCreated={() => { setShowNewOrder(false); fetchOrders() }}
        />
      )}

      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => { setShowProductForm(false); setEditingProduct(null) }}
          onSaved={(saved) => {
            setShowProductForm(false)
            setEditingProduct(null)
            // Auto-select the saved product in the detail panel
            setSelectedProduct(saved)
            fetchProducts()
          }}
        />
      )}
    </div>
  )
}
