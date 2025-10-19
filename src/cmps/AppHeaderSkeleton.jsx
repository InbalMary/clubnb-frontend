export function AppHeaderSkeleton({ isCompact, isIndexPage }) {
	const headerClass = isCompact 
		? `compact-header full ${isIndexPage ? 'index-page' : ''}`
		: `app-header full ${isIndexPage ? 'index-page' : ''}`

	const containerClass = isCompact ? 'compact-header-content' : 'nav-bar'

	return (
		<header className={`${headerClass} skeleton-header`}>
			<div className={containerClass}>
				{/* Logo skeleton */}
				<div className="logo-header">
					<div className="skeleton skeleton-logo"></div>
				</div>

				{/* Middle area - search bar skeleton */}
				{isCompact && (
					<div className="compact-search-button skeleton-search-compact">
						<div className="skeleton skeleton-search-text"></div>
						<div className="skeleton skeleton-search-divider"></div>
						<div className="skeleton skeleton-search-text"></div>
						<div className="skeleton skeleton-search-divider"></div>
						<div className="skeleton skeleton-search-text"></div>
						<div className="skeleton skeleton-search-icon"></div>
					</div>
				)}

				{/* Actions skeleton */}
				<div className="header-actions">
					<div className="skeleton skeleton-link"></div>
					<div className="skeleton skeleton-circle"></div>
					<div className="skeleton skeleton-circle"></div>
				</div>
			</div>

			{/* Expanded search area skeleton */}
			{!isCompact && (
				<div className="expanded-header-search">
					<div className="skeleton skeleton-expanded-search"></div>
				</div>
			)}
		</header>
	)
}